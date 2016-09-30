[![Build Status](https://travis-ci.org/mozilla/api.webmaker.org.svg)](https://travis-ci.org/mozilla/api.webmaker.org)
[![Coverage Status](https://coveralls.io/repos/mozilla/api.webmaker.org/badge.svg?branch=develop)](https://coveralls.io/r/mozilla/api.webmaker.org?branch=develop)

# api.webmaker.org

Webmaker services API.

## Prerequisites

You will need to download and install:

* **[Nodejs >= v4.6.0](https://nodejs.org/download)**
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

In order to quickly get up and running for development purposes, you will also want to create
at least one user by logging into your postgresql instance:

```
$> psql -d webmaker -U dbusername
```

and then issuing the following user record creation instruction:

```
pg> insert into users (id, username, language) VALUES (1, 'testuser', 'en-US');
```

This will let you call any of the API endpoints with userid **`1`** without running into
API errors due to missing users.

## Migration

Migration scripts can be found in the `migrations` folder.

You can run all the scripts in order with `npm run migrate` or run each individually for a partial migration `psql -U username -d dbname -f migrations/{migration_script}.sql`

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

The tests assume the user `postgres` exists and has no password set. They also assume that a database named `webmaker_testing` has been created, and that `postgres` has owner permissions. Create the database with `createdb -U postgres webmaker_testing`

#### Successfully working with New Relic

See the guide for [configuring New Relic using environment variables](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/configuring-nodejs-environment-variables) to configure the New Relic agent

## Optional Configuration

Variable                    | Description
----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------
MOCKED_AUTH                 | If used the server will bypass token validation. The header "Authorization:token <token>" is still required, but will always succeed

## Test

The tests require access to a postgreSQL database named `webmaker_testing`. Create it by running the command `createdb webmaker_testing`, the test script will automatically create tables and populate them with data.

Run the tests with `npm test`

## Migrations

Run database migrations with the following command `npm run migrate -- webmaker`

Substitute 'webmaker' in the last command with whichever database name your api is using.
It will apply all migration scripts in the migrations file in order.

## Bulk Action API

A bulk api endpoint exists to enable the client to execute many actions on the user's project, pages, elements in a single HTTP request instead of many individual ones.

* **URL**

  /user/{user}/bulk

* **Method**

  POST

* **Authentication**

  The Authorization header should contain a valid OAuth token provided by [id.webmaker.org](https://github.com/mozilla/id.webmaker.org/blob/develop/docs/oauth.md)

  `Authorization: token myoauth2tokenforwebmaker`

* **Body**

  Post body should be valid JSON. It should contain a single attribute, `actions`, an array of at least one, and at most 1000 individual actions to execute in serial.

  Each action should contain three properties, `type`, `method`, and `data`.
  Type must be one of 'projects', 'pages', or 'elements'.
  Method must be one of 'create', 'update' or 'remove'.
  Data must contain attributes and values specific to the type and method of the action:

  * projects
    * create
      * `title`
        * String, required, up to 256 characters
      * `thumbnail`
        * Object, containing a key ("320") which is the URL of the thumnail.
    * update
      * `id`
        * Number, or string containing decimal digits, representing the unique id of a project
      * `title`
        * String, required, up to 256 characters
    * remove
      * `id`
        * Number, or string containing decimal digits, representing the unique id of a project
  * pages
    * create
      * `projectId`
        * Number, or string containing decimal digits, representing a project's unique id
      * `x`
        * Number, the x coordinate of the page
      * `y`
        * Number, the y coordinate of the page
      * `styles`
        * Optional object containing styles values for the page. defaults to `{}`
    * update
      * `id`
        * Number, or string containing decimal digits, representing the unique id of a page
      * `x`
        * Number, the x coordinate of the page
      * `y`
        * Number, the y coordinate of the page
      * `styles`
        * Optional object containing styles values for the page. defaults to `{}`
    * remove
      * `id`
        * Number, or string containing decimal digits, representing the unique id of a page
  * elements
    * create
      * `pageId`
        * Number, or string containing decimal digits, representing the unique id of a page
      * `type`
        * String, represents the element type
      * `styles`
        * Optional object containing styles values for the page. defaults to `{}`
      * `attributes`
        * Optional object containing attributes values for the page. defaults to `{}`
    * update
      * `id`
        * Number, or string containing decimal digits, representing the unique id of a element
      * `styles`
        * Optional object containing styles values for the page. defaults to `{}`
      * `attributes`
        * Optional object containing attributes values for the page. defaults to `{}`
    * remove
      * `id`
        * Number, or string containing decimal digits, representing the unique id of a element


  You can reference future id values using the following syntax: `$1.id`, where the number following the dollar sign represents the index of the action, and the path following it is used to grab the id you're looking for. For example:

  ```json
  {
    "actions": [
      {
        "type": "projects",
        "method": "create",
        "data": {
          "title": "My Project"
        }
      },
      {
        "type": "pages",
        "method": "create",
        "data": {
          "projectId": "$0.id",
          "x": 0,
          "y": 0
        }
      }
    ]
  }
  ```

## Diagrams

The Webmaker API uses [id.webmaker.org](https://github.com/mozilla/id.webmaker.org) to authenticate users and requests using
Bearer tokens. Below is a sequence diagram describing how a create project request is handled for a first time user.

![webmaker-new-user](https://cloud.githubusercontent.com/assets/438003/7801687/cdca9876-02f6-11e5-87ce-3f2916155644.png)
