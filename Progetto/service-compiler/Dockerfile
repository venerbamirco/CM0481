FROM node:17-alpine

# Arguments
ARG LOCALHOST=172.17.0.1

# Environments vars
ENV HTTP_PORT="3000"
# Twice the maximum size of the source
ENV PAYLOAD_LIMIT="2mb" 

ENV COMPLETED_ENDPOINT="http://${LOCALHOST}:5000/completedCompilation"

ENV BUILD_PATH="/app/service-compiler/builds"
ENV BUILD_COMMAND="g++"
ENV SANDBOX_COMMAND="/usr/bin/sandbox.sh"
ENV SOURCE_FILE_NAME="main.cpp"
ENV PROGRAM_FILE_NAME="main"

ENV DEFAULT_TIMEOUT="10"
ENV MAX_TIMEOUT="30"

ENV DEFAULT_MEMORY="100000"
ENV MAX_MEMORY="250000"

ENV MAX_OUTPUT="1048576"

ENV SIZE_ID="36"
ENV MAX_FLAGS="10"
ENV MAX_INPUT="1024"
ENV MAX_SOURCE_CODE="1048576"

# Exposed port
EXPOSE $HTTP_PORT

# Install core-utils (stdbuf/etc)
RUN apk add coreutils

# Install dev-tools (gcc/g++/etc)
RUN apk add build-base

# Install bubblewrap
RUN apk add bubblewrap

# Copy sandbox utility script
COPY bin/sandbox.sh $SANDBOX_COMMAND
RUN chmod +x $SANDBOX_COMMAND

# Create app directory
WORKDIR /app/service-compiler

# Create build directory
RUN mkdir $BUILD_PATH

COPY package*.json ./

RUN npm install
COPY ./build/. .

CMD [ "node", "app.js" ]