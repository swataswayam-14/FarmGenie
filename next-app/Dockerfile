FROM node:18

WORKDIR /next-app

COPY package*.json ./
COPY prisma ./prisma

ENV DATABASE_URL="postgresql://swataswayamdash:Dcnhf1IajsW5@ep-gentle-math-a5z04t41.us-east-2.aws.neon.tech/farmgenie?sslmode=require"

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]