FROM node:18-alpine

WORKDIR /app/card-react

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

# -------------------->>>>>>>>>>>>--------------------------
# DOCKER IMAGE INSTRUCTION
# ----------------------------------------------------------
# docker build --tag react_card:1.0.0 .
# -------------------->>>>>>>>>>>>--------------------------

# -------------------->>>>>>>>>>>>--------------------------
# DOCKER CONTAINER INSTRUCTION
# ----------------------------------------------------------
# docker run
#     - it \ // interactive mode
#     -- name react_card_container \
#     -p 3000:3000 \ // externally connect port 4000 to local container react port 3000
#     -- rm \ // automatically remove the container when it shuts down
#     -d \ // start up the container in detached mood
#     react_card:1.0.0 \
# -------------------->>>>>>>>>>>>--------------------------
