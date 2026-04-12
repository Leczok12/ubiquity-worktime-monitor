FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY backend/package.json backend/package-lock.json ./backend/

RUN npm ci --ignore-scripts
RUN npm ci --prefix frontend
RUN npm ci --prefix backend

FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/package.json /app/package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

COPY frontend/ frontend/
COPY backend/ backend/
COPY types/ types/
COPY scripts/ scripts/

RUN cd backend && npx prisma generate
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
EXPOSE 9999

COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma
COPY --from=build /app/backend/prisma.config.ts ./backend/prisma.config.ts


WORKDIR /app/backend

# Teraz ścieżka jest relatywna do /app/backend
CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/backend/src/server.js"]