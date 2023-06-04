# FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY ./app /app/app
COPY ./clasificador_ver5.h5 /app/clasificador_ver5.h5