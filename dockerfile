# ETAP 1: Budowanie aplikacji
FROM node:20-alpine AS builder
ARG BUILD=true
WORKDIR /app

COPY package*.json ./

COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm install

RUN npm run install

COPY . .

RUN npm run prisma:generate

RUN npm run build

# ETAP 2: Obraz produkcyjny
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

RUN echo '#!/bin/sh' > start.sh && \
    echo 'cd backend' >> start.sh && \
    echo 'npm run prisma:migrate:deploy' >> start.sh && \
    echo 'cd ..' >> start.sh && \
    echo 'npm start' >> start.sh && \
    chmod +x start.sh

CMD ["./start.sh"]