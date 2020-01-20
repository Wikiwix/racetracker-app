FROM bitriseio/docker-android:latest

# ------------------------------------------------------
# --- Install required tools

RUN apt-get update -qq

# ------------------------------------------------------
# --- Cordova CLI

RUN npm install -g cordova
RUN cordova -v

# ------------------------------------------------------
# --- Install Ant

RUN apt-get install -y ant
RUN ant -version

# ------------------------------------------------------
# --- Define environment

WORKDIR /opt/mobile

# Copy everything needed to build the application, exclude files in .dockerignore
COPY . .

# Install all the packages
RUN yarn setup


# ------------------------------------------------------
# --- Cleanup and rev num

# Cleaning
RUN apt-get clean

ENV BITRISE_DOCKER_REV_NUMBER_ANDROID_CORDOVA 2016_01_24_1
CMD bitrise -version
