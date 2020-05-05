FROM python:3
ENV PYTHONBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
EXPOSE 8000
# RUN python3 manage.py makemigrations && python3 manage.py migrate --run-syncdb
# RUN python3 manage.py runserver 127.0.0.1:8000
