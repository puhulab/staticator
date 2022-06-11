FROM node:14.17

RUN apt-get update

RUN apt-get install httrack

RUN apt-get install nginx

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# /app/www folder will serve

RUN service nginx start

EXPOSE 80

# node scheduled httrack

ENV CRON "*/10 * * * *"

ENV HTTRACK_URI "https://farukcan.net"

ENV HTTRACK_OPTS "-O mirror"

CMD ["npm","run","prod"]
