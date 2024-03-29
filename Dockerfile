FROM node:16.13.0-alpine

WORKDIR /app

COPY . .

RUN npm i

WORKDIR /app/frontend

RUN npm run build

WORKDIR /app/backend

CMD ["node", "app.js"]

EXPOSE 8000
