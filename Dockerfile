FROM node:20.6.1 AS BUILD_IMAGE

WORKDIR /app
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3500

CMD ["npm", "run", "start"]