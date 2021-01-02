# pull official base image
FROM node:13.12.0

# set working directory
RUN mkdir /frontend
WORKDIR /frontend



# install app dependencies
COPY package.json /frontend
COPY package-lock.json /frontend

RUN yarn install

# add app
COPY . /frontend

# start app
CMD ["yarn", "start"]