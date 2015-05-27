# Webmaker API

FROM ubuntu:14.10
MAINTAINER Christopher De Cairos <cade@mozillafoundation.org>

# install curl and native postgre bindings
RUN apt-get update && apt-get install -y \
  curl \
  libpq-dev

# Install nodejs 0.12.x PPA
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -

# install nodejs v0.12.x
RUN apt-get update && apt-get install -y \
  nodejs

# Add webmaker-api source code and dependencies
ADD . /var/www/api

# Set working directory to Webmaker API directory
WORKDIR /var/www/api

# Set Default env
RUN cp /var/www/api/env.sample /var/www/api/.env

# Expose default webmaker-api port
EXPOSE 2015

# Command to execute when starting Webmaker API
CMD ["node","server"]
