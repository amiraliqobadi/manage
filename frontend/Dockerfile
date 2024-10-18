# Use the official Node.js image
FROM node:16-alpine 

# Set the working directory
WORKDIR /srv/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that Vite uses
EXPOSE 8000

# Command to run the Vite development server
CMD ["npm", "run", "dev"]