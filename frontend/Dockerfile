# pull official base image
FROM node:13.12.0

RUN mkdir /frontend
WORKDIR /frontend

COPY . .
RUN npm install
RUN npm run build