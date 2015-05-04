[![Build Status](https://travis-ci.org/mozilla/api.webmaker.org.svg)](https://travis-ci.org/mozilla/api.webmaker.org)

# api.webmaker.org

Webmaker services API.

## Installation

You will need to run [postgeSQL](http://www.postgresql.org/download/)

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
psql -d webmaker -f migrations/create_webmaker_db.sql
```

## Run

Start the server with `npm start`

You can view documentation by navigating to `http://localhost:2015/docs` in your browser

## Test

Run the tests with `npm test`
