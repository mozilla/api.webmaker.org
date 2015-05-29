[![Build Status](https://travis-ci.org/mozilla/api.webmaker.org.svg)](https://travis-ci.org/mozilla/api.webmaker.org)
[![Coverage Status](https://coveralls.io/repos/mozilla/api.webmaker.org/badge.svg?branch=develop)](https://coveralls.io/r/mozilla/api.webmaker.org?branch=develop)

# api.webmaker.org

Webmaker services API.

## Prerequisites

You will need to download and install:

* **[Nodejs >= v0.12.1](https://nodejs.org/download) OR [iojs >= v1.0.0](https://iojs.org)**
* **[postgreSQL >= v9.4](http://www.postgresql.org/download/)**

## Installation

```
# Clone the repo
git clone https://github.com/mozilla/api.webmaker.org

# change into project directory
cd api.webmaker.org

# install dependencies using npm
npm install

# copy default environment config
cp env.sample .env

# create a database
createdb webmaker

# create tables
psql -d webmaker -f scripts/create-tables.sql
```

## Run

Start the server with `npm start`

You can view documentation by navigating to `http://localhost:2015/docs` in your browser

## Configuration

Variable                    | Description                                                                                                  | Default
----------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------
API_HOST                    | The Host that Hapi should listen for connections on                                                          | 0.0.0.0
PORT                        | The port number that Hapi should listen for connections on                                                   | 2015
API_VERSION                 | The Version Number of the API, applied to newly created projects                                             | 'dev'
LOG_LEVEL                   | given a chosen level, log events only at or above that level. debug < info < warn < error < exception < stat | info
POSTGRE_CONNECTION_STRING   | A connection string to a PostgreSQL server                                                                   | postgresql://localhost:5432/webmaker
ID_SERVER_CONNECTION_STRING | A connection string to a [Webmaker ID server](https://github.com/mozilla/id.webmaker.org)                    | https://id.mofostaging.net

## Test

The tests require access to a postgreSQL database named `webmaker_testing`. Create it by running the command `createdb webmaker_testing`, the test script will automatically create tables and populate them with data.

Run the tests with `npm test`

## Diagrams

The Webmaker API uses [id.webmaker.org](https://github.com/mozilla/id.webmaker.org) to authenticate users and requests using
Bearer tokens. Below is a sequence diagram describing how a create project request is handled for a first time user.

![webmaker-new-user](https://cloud.githubusercontent.com/assets/438003/7801687/cdca9876-02f6-11e5-87ce-3f2916155644.png)

## Docker

The API can be run using [Docker](https://www.docker.com).

You can run just the api by issuing the following command:

`sudo docker run -p 2015:2015 -d cade/webmaker-api`

To build your own container, run:

`sudo docker build .` from the project root

The API will now be available on `http://localhost:2015`

You can also use [docker-compose](http://docs.docker.com/compose/) to get the API and PostgreSQL running together.

`sudo docker-compose build && sudo docker-compose up -d`

Then, create the database tables (first run only):

`psql -h localhost -U webmaker -f scripts/create-tables.sql`

The API will now be available on `http://localhost:2015` and connect to a postgresql database running in a docker container.
