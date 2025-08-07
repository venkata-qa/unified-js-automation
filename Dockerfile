# Use official Playwright image as base
FROM mcr.microsoft.com/playwright:v1.53.2-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs reports/allure/results reports/allure/html

# Set permissions
RUN chmod +x scripts/*.js

# Expose ports for reports
EXPOSE 3000

# Environment variables
ENV NODE_ENV=docker
ENV CI=true
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default command
CMD ["npm", "run", "test:regression:allure"]
