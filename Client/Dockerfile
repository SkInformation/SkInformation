# Use Node 21 in a limited environment (reference: https://hub.docker.com/_/node)
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy the Next.js app to the /app directory
COPY . .

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]