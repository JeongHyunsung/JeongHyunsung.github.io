FROM node:20

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci -qy
RUN npm install -g nodemon

COPY . .

EXPOSE 5000