# Use official Node image for building React app
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the React app code
COPY . .

# Build the React app for production
RUN npm run build

# ============================
# Use a lightweight web server image to serve the build folder
FROM nginx:alpine

# Copy the React build output to the Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
