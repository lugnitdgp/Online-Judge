# pull official base image
FROM node:14

RUN mkdir /frontend

COPY package.json /frontend
COPY yarn.lock /frontend

COPY . /frontend
WORKDIR /frontend

RUN yarn install
# RUN yarn add sharp@0.26.3
RUN yarn run build