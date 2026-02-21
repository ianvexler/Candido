# Use an official Node.js runtime as a parent image
FROM node:24-alpine
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
# We do this separately to leverage Docker cache for dependencies
COPY package*.json ./

COPY prisma ./prisma
COPY prisma.config.ts ./

ENV DATABASE_URL="postgresql://localhost:5432/dummy"
RUN npm install
# Copy the rest of the application code
COPY . .
# Expose the port your Node.js app listens on
EXPOSE 5000
# Define the command to run your app
CMD ["npm", "start"]