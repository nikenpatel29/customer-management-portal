# Use Node 19
FROM node:19-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY ../.. .

# Build the app
RUN npm run build

# Serve with a lightweight server
RUN npm install -g serve
EXPOSE 5173
CMD ["serve","-s","build","-l","5173"]
