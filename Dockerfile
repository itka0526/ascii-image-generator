FROM node:16.20.0

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 4001

ENV PORT=4001

ENV NODE_ENV=production

CMD [ "npm", "start" ]