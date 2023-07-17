FROM node:14.17

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

# node scheduled httrack

ENV TRACK_URL "https://farukcan.net"

CMD ["npm","run","prod"]
