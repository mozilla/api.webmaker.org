[![Build Status](https://travis-ci.org/mozilla/api.webmaker.org.svg)](https://travis-ci.org/mozilla/api.webmaker.org)
[![Coverage Status](https://coveralls.io/repos/mozilla/api.webmaker.org/badge.svg?branch=develop)](https://coveralls.io/r/mozilla/api.webmaker.org?branch=develop)

# api.webmaker.org

Webmaker services API.

## Prerequisites

You will need to download and install:

* **[Nodejs >= v0.12.1](https://nodejs.org/download) OR [iojs >= v1.0.0](https://iojs.org)**
* **[postgreSQL >= v9.4](http://www.postgresql.org/download/)**
* **[redis >= v3.0](http://redis.io/download)**

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

# create a database; -U and -W are only necessary if your pg instance needs authentication
createdb -U dbusername -W dbuserpassword webmaker

# create tables; -U and -W are only necessary if your pg instance needs authentication
psql -U dbusername -W dbuserpassword -d webmaker -f scripts/create-tables.sql
```

### Note: this will set up an empty database

In order to quickly get up and running
for development purposes, you will also want to create at least one user by logging
into your postgresql instance:

```
$> psql -d webmaker -U dbusername
```

and then issuing the following user record creation instruction:

```
pg> insert into users (id, username, language, country) VALUES (1, 'testuser', 'en', 'US');
```

This will let you call any of the API endpoints with userid **`1`** without running into API errors due to missing users.

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
REDIS_URL                   | A connection string to a redis server                                                                        | redis://localhost:6379
ID_SERVER_CONNECTION_STRING | A connection string to a [Webmaker ID server](https://github.com/mozilla/id.webmaker.org)                    | https://id.mofostaging.net
THUMBNAIL_SERVICE_URL       | The URL where [webmaker-screenshot](https://github.com/mozilla/webmaker-screenshot) can be reached           | undefined (screenshots disabled)
PAGE_RENDER_URL             | The URL where [webmaker-desktop](https://github.com/mozilla/webmaker-desktop) can be reached                 | undefined (must defined if screenshots enabled)

### An important note for default PostgreSQL installations:

If you are using a vanilla PostgreSQL instance, you will either need to allow unauthenticated connections, or modify the `POSTGRE_CONNECTION_STRING` such that it is using the correct username and password, by using for following format instead of the one that is used in the `sample.env` file:

```
export POSTGRE_CONNECTION_STRING=postgresql://username:password@localhost:5432/webmaker
```
For default installations, this will have username `postgres`, with the password that you had to fill in during the PostgreSQL installation process.

#### Successfully working with New Relic

See the guide for [configuring New Relic using environment variables](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/configuring-nodejs-environment-variables) to configure the New Relic agent

## Test

The tests require access to a postgreSQL database named `webmaker_testing`. Create it by running the command `createdb webmaker_testing`, the test script will automatically create tables and populate them with data.

Run the tests with `npm test`

## Diagrams

The Webmaker API uses [id.webmaker.org](https://github.com/mozilla/id.webmaker.org) to authenticate users and requests using
Bearer tokens. Below is a sequence diagram describing how a create project request is handled for a first time user.

![webmaker-new-user](https://cloud.githubusercontent.com/assets/438003/7801687/cdca9876-02f6-11e5-87ce-3f2916155644.png)
