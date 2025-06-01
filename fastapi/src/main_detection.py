# -*- coding: utf-8 -*-

import uvicorn, traceback, logging, time, redis, datetime, asyncio, ast, random, json, os, nest_asyncio
from   fastapi                 import FastAPI, Request, Response
from   fastapi.middleware.cors import CORSMiddleware
from   fastapi.responses       import StreamingResponse, JSONResponse
from   anyio.lowlevel          import RunVar
from   anyio                   import CapacityLimiter
from   redis.lock              import Lock
from   threading               import Thread
from   functools               import partial
from   detection               import YOLObjectDetection
nest_asyncio.apply()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # или "*" для разработки
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_detection = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)
# redis_detection.flushall()
global_lock = Lock(redis_detection, "global_lock")

logger = logging.getLogger()
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
fh = logging.FileHandler(filename='main.log', mode="a")
formatter = logging.Formatter(
    "%(asctime)s - %(module)s - %(funcName)s - line:%(lineno)d - %(levelname)s - %(message)s"
)

ch.setFormatter(formatter)
fh.setFormatter(formatter)
logger.addHandler(ch)
logger.addHandler(fh)

try:
    @app.on_event("startup")
    async def startup_event():
        logger = logging.getLogger("uvicorn.access")
        handler = logging.FileHandler(filename='api.log', mode="a")
        handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
        logger.addHandler(handler)
        RunVar("_default_thread_limiter").set(CapacityLimiter(1000))

    @app.get("/devices/all")
    async def get_devices():
        try:
            with global_lock:
                keys_data = redis_detection.keys("device:*")

            if not keys_data:
                return []

            list_devices = []       
            for key in keys_data:
                with global_lock:
                    device_data = redis_detection.get(key)
                if device_data:
                    device_data = ast.literal_eval(device_data)
                    list_devices.append(device_data)      
            return list_devices
        
        except:
            logger.error(f"{traceback.format_exc()}\get_devices")
            print(traceback.format_exc(), "get_devices")
            return Response(status_code=500)
    
    @app.get("/devices/delete/{device_id}")
    async def get_device(device_id: int):
        try:
            with global_lock:
                redis_detection.delete(f"device:{device_id}")
            return Response(str(device_id), status_code=200)
        
        except:
            logger.error(f"{traceback.format_exc()}\get_device")
            print(traceback.format_exc(), "get_device")
            return Response(status_code=500)

    @app.get("/devices/{device_id}")
    async def delete_device(device_id: int):
        try:
            with global_lock:
                device_data = redis_detection.get(f"device:{device_id}")
            if device_data:
                device_data = ast.literal_eval(device_data)
            return JSONResponse(content=device_data, status_code=200)
        
        except:
            logger.error(f"{traceback.format_exc()}\get_device")
            print(traceback.format_exc(), "get_device")
            return Response(status_code=500)

    @app.post("/devices/add")
    async def add_device(request: Request):
        nn = {"model": "retrained_YOLOv8-best.pt", "device_nn": "cuda", "conf": 0.3, "iou": 0.3}
        track = {"min_hits": 4, "max_age": 25, "iou": 0.3}
        try:
            data = await request.json()
            data['nn'] = nn
            data['track'] = track
            if len([k for k, v in data.items() if k in ['device', 'nn', 'track'] and type(v) == dict]) == 3:
                with global_lock:
                    keys_data = redis_detection.keys()
                busy_ids = [k.split(":")[-1] for k in keys_data if 'device' in k] if keys_data != None else []
                device_id = None
                while device_id is None:
                    n = random.randint(1, 100000)
                    device_id = n if n not in busy_ids else device_id
                data['device']['id'] = device_id
                data['nn']['id'] = device_id
                data['track']['id'] = device_id
                with global_lock:
                    redis_detection.set(f"device:{device_id}", str(data['device']))
                    redis_detection.set(f"nn:{device_id}", str(data['nn']))
                    redis_detection.set(f"track:{device_id}", str(data['track']))
                return Response(str(device_id), status_code=200)
            else:
                return Response(status_code=400)

        except:
            logger.error(f"{traceback.format_exc()}\nadd_device")
            print(traceback.format_exc(), "add_device")
            return Response(status_code=500)

    @app.get("/devices/{device_id}/detection/video")
    async def video_feed(device_id: int):
        detector = None
        try:
            def generate():
                for frame in detector.generate_frames():
                    yield (
                            b'--frame\r\n'
                            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'
                    )

            with global_lock:
                device_data = redis_detection.get(f"device:{device_id}")
                nn_data = redis_detection.get(f"nn:{device_id}")
                track_data = redis_detection.get(f"track:{device_id}")
            if device_data and nn_data and track_data:
                device_data = ast.literal_eval(device_data)
                nn_data = ast.literal_eval(nn_data)
                track_data =ast.literal_eval(track_data)
                detector = YOLObjectDetection(
                    cap=device_data['ip_address'], device=nn_data['device_nn'], model=f"./models/{nn_data['model']}"
                )
                detector.detect_video_camera()
                return StreamingResponse(generate(), media_type='multipart/x-mixed-replace; boundary=frame')
            else:
                return Response(status_code=404)

        except:
            logger.error(f"{traceback.format_exc()}\nvideo_feed")
            if detector:
                detector.stop()
            print(traceback.format_exc(), "video_feed")
            return Response(status_code=500)

except Exception:
    logger.error(f"{traceback.format_exc()}\nmain_main")
    print(traceback.format_exc())

if __name__ == "__main__":
    uvicorn.run("main_detection:app", host="localhost", port=8200, workers=4)