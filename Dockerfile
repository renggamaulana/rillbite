# 1. Base image
FROM node:20-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy dependency files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Build Next.js
RUN npm run build

# 7. Expose port
EXPOSE 3000

# 8. Run app
CMD ["npm", "start"]
