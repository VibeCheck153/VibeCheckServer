FROM node:16-alpine AS BUILD_IMAGE

WORKDIR /app

COPY . .