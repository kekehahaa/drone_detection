import cv2, torch, threading
import numpy as np

from time import time
from queue import Queue
from ultralytics import YOLO
from pathlib import Path
from sort import Sort


class YOLObjectDetection:
    def __init__(self, cap: str,
                 device: str = None,
                 model: str = "yolov8n.pt",
                 conf_thres: float = 0.3,
                 iou_thres_neural: float = 0.5,
                 iou_thres_sort: float = 0.2,
                 max_age: int = 100,
                 min_hits: int = 4):

        self.frame_queue = Queue(maxsize=5)
        self.result_queue = Queue(maxsize=5)

        self.cap = cv2.VideoCapture(cap)
        assert self.cap.isOpened()
        self.lock = threading.Lock()
        self.stop_event = threading.Event()

        self.device = self.set_device(device)
        print("Using device:", self.device)

        self.model = self.load_model(model)
        self.conf_thres = conf_thres
        self.iou_thres_neural = iou_thres_neural

        self.iou_thres_sort = iou_thres_sort
        self.min_hits = min_hits
        self.max_age = max_age
        self.sort = Sort(self.max_age, self.min_hits, self.iou_thres_sort)

        self.capture_thread = None
        self.process_thread = None

    def set_device(self, device: str = None, cuda=False):
        if device and not cuda:
            return device

        if torch.cuda.is_available():
            return torch.cuda.get_device_name(0)
        elif torch.backends.mps.is_available() and torch.backends.mps.is_built():
            return "mps"

        return "cpu"

    def set_conf(self, conf_thres):
        self.conf_thres = conf_thres

    def set_iou_neural(self, iou_thres_neural):
        self.iou_thres_neural = iou_thres_neural

    def set_iou_sort(self, iou_thres_sort):
        self.iou_thres_sort = iou_thres_sort
        self.sort = Sort(self.max_age, self.min_hits, self.iou_thres_sort)

    def set_max_age(self, max_age):
        self.max_age = max_age

    def set_min_hits(self, min_hits):
        self.min_hits = min_hits

    def load_model(self, model_path: str = "yolov8n.pt"):
        if not Path(model_path).is_file():
            model_path = "yolov8n.pt"
            print(f"Model file {model_path} not found.\n Will use YOLOv8n.pt.")

        model = YOLO(model_path).to(self.device)
        model.fuse()

        return model

    def predict(self, frame):
        results = self.model.predict(frame, verbose=False, conf=self.conf_thres, iou=self.iou_thres_neural, device=self.device)

        return results

    def get_results(self, results):
        max_det = 20
        detections = np.empty((max_det, 5))

        count = 0
        for result in results[0]:
            if count >= max_det:
                break

            bbox = result.boxes.xyxy.cpu().numpy()[0]
            conf = result.boxes.conf.cpu().numpy()[0]
            detections[count] = [bbox[0], bbox[1], bbox[2], bbox[3], conf]

            count += 1

        return detections[:count]

    def get_detection_classes(self):
        return self.model.names

    def draw_bbox(self, img, bboxes, ids=None):
        for bbox, id_ in zip(bboxes, ids):
            cv2.rectangle(img, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])), (0, 0, 255), 1)
            cv2.putText(img, "ID: " + str(id_), (int(bbox[0]), int(bbox[1] - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 4)

        self.result_queue.put(img)

        return img

    def capture_frames(self, cap: cv2.VideoCapture):
        while not self.stop_event.is_set():
            ret, frame = cap.read()
            if ret is None:
                break

            self.frame_queue.put(frame)

    def process_frames(self, sort: Sort):
        count = 0
        while not self.stop_event.is_set():
            start_time = time()
            frame = self.frame_queue.get()
            if frame is None:
                break

            results = self.predict(frame)
            detections_list = self.get_results(results)

            if len(detections_list) == 0:
                detections_list = np.empty((0, 5))

            res = sort.update(detections_list)

            boxes_track = res[:, :-1]
            boxes_ids = res[:, -1].astype(int)

            frame = self.draw_bbox(frame, boxes_track, boxes_ids)
            end_time = time()
            fps = 1 / np.round(end_time - start_time, 2)

            cv2.putText(frame, f'FPS: {int(fps)}', (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        print(count, "vsego")

    def detect_video_camera(self, display: bool = True):

        self.capture_thread = threading.Thread(target=self.capture_frames, args=(self.cap,), )
        self.process_thread = threading.Thread(target=self.process_frames, args=(self.sort,), )
        self.capture_thread.start()
        self.process_thread.start()

    def generate_frames(self):
        try:
            while not self.stop_event.is_set():
                frame = self.result_queue.get()
                if frame is None:
                    break
                ret, jpeg = cv2.imencode('.jpg', frame)
                if ret:
                    yield jpeg.tobytes()
        finally:
            self.stop()

    def stop(self):
        if not self.stop_event.is_set():
            self.stop_event.set()
            while not self.frame_queue.empty():
                self.frame_queue.get()
            while not self.result_queue.empty():
                self.result_queue.get()
            self.frame_queue.put(None)
            self.result_queue.put(None)
            self.capture_thread.join()
            self.process_thread.join()
            self.cap.release()

# if __name__ == "__main__":
#     detector = YOLObjectDetection(cap="/Users/kekehaha/Downloads/E88 Pro 4K Dual Camera Drone Flying ｜ E88 Drone Camera Test ｜ E88 Pro Camera Drone Flying Test (online-video-cutter.com).mp4",
#                                   device="mps",
#                                   model="/Users/kekehaha/Downloads/best (21).pt")
#     detector.detect_video_camera()
#     # detector.detect_video(1)