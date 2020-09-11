FROM node:14-alpine

COPY . .

RUN cd Server && npm install

CMD node Server/fetch.js