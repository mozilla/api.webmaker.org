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

## Test

The tests require access to a postgreSQL database named `webmaker_testing`.
Create it by running the command `createdb webmaker_testing`, the test script will automatically create tables and populate them with data.

Run the tests with `npm test`
