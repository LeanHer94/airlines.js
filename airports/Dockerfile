FROM node:latest

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3002

CMD npm start