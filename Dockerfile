# 1. Use Node 22 (LTS in 2026)
FROM node:22-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first to leverage Docker cache
COPY package*.json ./

# 4. Install all dependencies (needed for build)
RUN npm install

# 5. Copy the rest of the application
COPY . .

# 6. Build the TypeScript into JavaScript (dist/ folder)
RUN npm run build

# 7. Expose the port (Render default is 10000, yours is 5000)
EXPOSE 5000

# 8. Start the application
CMD ["npm", "start"]