# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies to compile TS)
RUN npm ci

# Copy configuration files
COPY tsconfig*.json ./

# Copy source code
COPY src ./src

# Compile TypeScript to JavaScript and resolve path aliases
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built code from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose backend API and Socket.IO port
EXPOSE 3000

# Start Express server
CMD ["npm", "start"]