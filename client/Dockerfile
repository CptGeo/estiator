# Begin with setting up the base image for the container
FROM node:18-alpine

# Add labels for documentation purposes
LABEL maintainer="george.kalyvianakis@gmail.com"

# Copy package-lock.json and package.json for dependencies
COPY package*.json .

# Copy scripts directory as it is necessary for the build stage
COPY scripts scripts

# Install dependencies
RUN npm install

# Install serve package globally
RUN npm i -g serve

# Copy all directory contents to container
COPY . .

# Build application
RUN npm run build

# Export port to outer world
EXPOSE 8080

# Serve static export from /dist to exposed port
CMD [ "serve", "-s", "dist", "-p", "8080" ]