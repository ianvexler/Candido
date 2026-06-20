FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=$DATABASE_URL

RUN npm ci

COPY . .
RUN npx prisma generate
RUN mkdir -p uploads

ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000

USER node

CMD ["npm", "start"]
