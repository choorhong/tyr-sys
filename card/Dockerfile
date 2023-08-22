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

# -------------------->>>>>>>>>>>>--------------------------
# DOCKER IMAGE INSTRUCTION
# ----------------------------------------------------------
# docker build \ 
# --build-arg DEFAULT_PORT=80 (Default to 80) // optional flag
# -t node_card:1.0.0 . 
# -------------------->>>>>>>>>>>>--------------------------

# -------------------->>>>>>>>>>>>--------------------------
# DOCKER CONTAINER INSTRUCTION
# ----------------------------------------------------------
# docker run
#     --name node_card_container \
#     -p 80:80 \ // externally connect port 80 to local container port 80
#     --rm \ // optional flag to automatically remove the container when it shus down
#     -d \ // optional flag to start up the container in detached mood
#     node_card:1.0.0 \
# -------------------->>>>>>>>>>>>--------------------------

# -------------------->>>>>>>>>>>>--------------------------
# DOCKER CONTAINER START/RESTART INSTRUCTION
# ----------------------------------------------------------
# docker start / restart \ ONLY IF --rm flag is not passed during initial container creation 
#     - start - command to start a stopped container. 
#     - restart - command to first stop a running container and then a start. If the container is already stopped, it is functionally the same as docker start.
#     - i \ // interactive mode, mandatory flags for react containerization
#     
#     -p 4000:3000 \ // no longer needed as it is memoized
#     -t \ // no longer needed as it is memoized
#     -d \ // this flag is no available for restart or start command. Hence, start/restart will automatically result in attached mode
# -------------------->>>>>>>>>>>>--------------------------
