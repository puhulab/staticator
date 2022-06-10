FROM node:14.17

RUN apt-get update

RUN apt-get install httrack

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run","prod"]
