FROM node:16

WORKDIR /next-app

COPY package*.json ./

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]