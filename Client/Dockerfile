FROM node:20

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci -qy

COPY . .

ENV http_proxy http://localhost:5000
ENV https_proxy http://localhost:5000

EXPOSE 3000