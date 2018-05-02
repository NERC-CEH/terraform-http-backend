FROM node:8.11.1-alpine

LABEL maintainer="gareth.lloyd@stfc.ac.uk"

ARG CONTAINER_IMAGE_VERSION
ENV CONTAINER_IMAGE_VERSION ${CONTAINER_IMAGE_VERSION:-undefined}

RUN mkdir -p /usr

COPY ./package.json /usr

WORKDIR /usr

RUN yarn install --silent

COPY ./src /usr/src

RUN yarn dist

RUN yarn install --silent --production && yarn cache clean

WORKDIR /usr/dist

EXPOSE 8000

CMD ["node", "server.js"]
