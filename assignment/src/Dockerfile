# Stage 1: Build the React application
FROM node:14 as build

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Create the production image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the built React application from the previous stage
COPY --from=build /app/build .

# Expose the port that the application will run on
EXPOSE 3000

# Run the command to start the application when the container launches
CMD ["npm", "start"]