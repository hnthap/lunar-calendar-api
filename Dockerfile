# ---- Build stage ----
# Installing all dependencies and compiling the TypeScript code into
# JavaScript.

FROM node:24.7.0-alpine3.21 AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage ----
# Production image with only the compiled JavaScript code and production
# dependencies.

FROM node:24.7.0-alpine3.21
WORKDIR /app
COPY --from=builder /root/.npm /root/.npm
COPY package*.json .
RUN npm ci --omit=dev --prefer-offline
COPY --from=builder /app/js ./js
CMD ["node", "js/src/index.js"]

# ---- Test stage ----
# Running the tests.
# To run tests, use: docker build --target tester .

FROM builder AS tester
RUN npm test
