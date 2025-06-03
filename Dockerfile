# Use official Node.js 18 Alpine image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only (layer caching enabled)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy rest of the application
COPY . .

# Generate Prisma client and build app
RUN npx prisma generate && npm run build

# Final production image
FROM node:18-alpine AS production

WORKDIR /app

# Only copy necessary files from the build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma

# Generate Prisma client again if needed in runtime (optional)
# RUN npx prisma generate

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "start"]