# Drone System Detection

Этот проект предоставляет систему детектирования с видеокамер.

## Requirements

Ensure you have the following installed:

- [Python 3.11+](https://www.python.org/downloads/)
- [Virtual Environments with Python 3.11+](https://docs.python.org/3/tutorial/venv.html)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Запуск проекта

Для создания образа и запуска контейнера перейдите в клонированный репозиторий и выполните команду:

- ```bash
    ./all_restart.sh
    ```

## Описание эндпойнтов

Для взаимодействия с системой откройте браузер и перейдите по ссылке: http://localhost:5173/devices

##### Вывод программы, которая показывает содержимое отправленного zipfile с нарезанным фото.
```zsh
python train.py
Содержимое архива: ['frame_00059.jpg', 'frame_00058.jpg', 'frame_00060.jpg', 'frame_00048.jpg', 'frame_00049.jpg', 'frame_00012.jpg', 'frame_00006.jpg',
'frame_00007.jpg', 'frame_00013.jpg', 'frame_00039.jpg', 'frame_00005.jpg', 'frame_00011.jpg', 'frame_00010.jpg', 'frame_00004.jpg', 'frame_00038.jpg',
'frame_00014.jpg', 'frame_00028.jpg', 'frame_00029.jpg', 'frame_00015.jpg', 'frame_00001.jpg', 'frame_00017.jpg', 'frame_00003.jpg', 'frame_00002.jpg',
'frame_00016.jpg', 'frame_00033.jpg', 'frame_00027.jpg', 'frame_00026.jpg', 'frame_00032.jpg', 'frame_00018.jpg', 'frame_00024.jpg', 'frame_00030.jpg',
'frame_00031.jpg', 'frame_00025.jpg', 'frame_00019.jpg', 'frame_00021.jpg', 'frame_00035.jpg', 'frame_00009.jpg', 'frame_00008.jpg', 'frame_00034.jpg',
'frame_00020.jpg', 'frame_00036.jpg', 'frame_00022.jpg', 'frame_00023.jpg', 'frame_00037.jpg', 'frame_00050.jpg', 'frame_00044.jpg', 'frame_00045.jpg',
'frame_00051.jpg', 'frame_00047.jpg', 'frame_00053.jpg', 'frame_00052.jpg', 'frame_00046.jpg', 'frame_00042.jpg', 'frame_00056.jpg', 'frame_00057.jpg',
'frame_00043.jpg', 'frame_00055.jpg', 'frame_00041.jpg', 'frame_00040.jpg', 'frame_00054.jpg']
```
