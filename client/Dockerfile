FROM node:18-alpine

RUN npm i -g serve

COPY ./dist /

EXPOSE 80

CMD [ "serve", "-s", ".", "-p", "80" ]