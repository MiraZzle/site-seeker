# Use the base image for the backend environment, for example, Node.js
FROM node:20

# Set the working directory in the container
WORKDIR /siteseeker/backend

# Copy the backend package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Expose the port the backend is running on (e.g., 3000)
# TODO: Update the port number if the backend is running on a different port
EXPOSE 3000

# Start the backend server
CMD ["node", "src/server.mjs"]
