FROM node:alpine

WORKDIR /usr/src/app

# RUN npm install -g nodemon

COPY ./package*.json ./
RUN npm install && npm install -g mocha

COPY . .

ENV NODE_ENV=${NODE_ENV}
ENV DATABASE=mongodb://mongodb:27017/billit
ENV PORT=3005

EXPOSE 3005
EXPOSE 27017

CMD [ "npm", "start"]
