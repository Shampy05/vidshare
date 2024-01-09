# Stage 1
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build


# Stage 2 - Production
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy build files from stage 1
COPY --from=builder /app/.next ./.next 
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Run application
CMD ["npm", "start"]
