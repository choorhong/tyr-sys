FROM node:18-alpine

WORKDIR /app/card

# Copy installable dependecies json files
COPY package*.json .

# Install dependencies
RUN npm install

COPY . .

ARG DEFAULT_PORT=80
ENV PORT=${DEFAULT_PORT}
EXPOSE ${PORT}

# Start the application
CMD ["npm", "run", "dev"]