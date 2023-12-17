# Use Node 21 in a limited environment (reference: https://hub.docker.com/_/node)
FROM node:21-alpine

ARG NEXT_PUBLIC_API_URL=http://localhost:5100
ARG NEXT_PUBLIC_IMG_URL=http://172.28.0.1:80

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_IMG_URL=$NEXT_PUBLIC_IMG_URL

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