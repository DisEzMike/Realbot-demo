FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json .

# Update aptitude with new repo
RUN apk update

# Let's install everything! 
RUN npm install npm -g \
    && npm install \
    && npm install -g typescript ts-node tslib

# RUN git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg

COPY . .

EXPOSE 3000

CMD ["ts-node", "."]