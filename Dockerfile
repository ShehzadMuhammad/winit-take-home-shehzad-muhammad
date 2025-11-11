# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files and build the project
COPY . .
RUN npm run build

# -------------------------------
# Stage 2: Runtime
# -------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built artifacts and production dependencies
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]

