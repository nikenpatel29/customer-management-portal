# Use Node 19
FROM node:19-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source code from current directory
COPY . .

# Build the app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Serve the built files (Vite builds to 'dist' by default)
CMD ["serve", "-s", "dist", "-l", "5173"]