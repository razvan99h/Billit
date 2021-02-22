FROM node:alpine

WORKDIR /usr/src/app

# RUN npm install -g nodemon

COPY ./package*.json ./
RUN npm install && npm install -g mocha

COPY . .

ENV NODE_ENV=${NODE_ENV}
ENV DATABASE=mongodb://mongodb:27017/billit
ENV PORT=3005
ENV JWT_SECRET=c8df6a448a1547c74d278c0e330961ad45c82cb5efb28304c4db0dccf596df317a4d6568c0b402759ca7548184accc357799593e47242c045753217e63862942

EXPOSE 3005
EXPOSE 27017

CMD [ "npm", "start"]
