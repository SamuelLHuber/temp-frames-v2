# Build stage
FROM node:alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

RUN npm run build

# Production stage
FROM node:alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

# Install only production dependencies
RUN npm ci --only=production

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
