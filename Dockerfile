FROM node:18-alpine

WORKDIR /app/card

# Copy app files from src directory
COPY card .

# Install app dependencies
RUN npm install

# Start the application
CMD ["npm", "run", "card"]