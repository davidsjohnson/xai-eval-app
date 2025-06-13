# Dockerfile

# Use a lightweight Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the src/server directory to /app
COPY src/server /app/server

# Copy the src/package.json file to /app
COPY package.json /app

RUN ls -al /app

# Install required npm packages
RUN npm install

# Expose port 7000
EXPOSE 7000

# Start the application
CMD ["node", "server/server.js"]

