FROM nvidia/cuda:12.2.2-devel-ubuntu22.04

WORKDIR /app
RUN sed -i \
    -e 's|http://archive.ubuntu.com|http://mirror.yandex.ru|g' \
    -e 's|http://security.ubuntu.com|http://mirror.yandex.ru|g' \
    /etc/apt/sources.list && \
    apt-get update
RUN apt-get install -y --no-install-recommends dumb-init python3-pip python-is-python3 wget git nano redis-server \
        procps curl xauth \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /usr/lib/x86_64-linux-gnu/libmfxhw* \
    && rm -f /usr/lib/x86_64-linux-gnu/mfx/*

RUN mkdir -p /run/user/
ENV XDG_RUNTIME_DIR=/run/user

COPY requirements.txt .

RUN pip install -r requirements.txt  \
    && rm -rf /root/.cache
COPY src .

RUN apt-get update && apt-get install -y libgl1 libglib2.0-0
RUN pip install --no-cache-dir scikit-image
RUN pip install --no-cache-dir filterpy

EXPOSE 8200

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["sh", "-c", "service redis-server start && /usr/bin/python3 -u /app/main_detection.py"]