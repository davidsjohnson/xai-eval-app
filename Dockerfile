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

# Expose port from build argument or default to 7000
# You can override the PORT value at build time using: docker build --build-arg PORT=your_port
ARG PORT=7000
EXPOSE ${PORT}

# Start the application and pass the port as an environment variable
ENV PORT=${PORT}
CMD ["node", "server/server.js"]
