# api.webmaker.org

This is where we'll build Webmaker services.

## Authentication Requirements

### Basic requirements

- should use the `login.webmaker.org` Oauth2 provider
- must work on Android and Android web views (client side/mobile token-based strategy)
- if possible, a dev instance of Oauth2 provider should be accessible without specific origin requirements or access to privileged credentials

### User Roles

#### Unauthenticated users
- should be able to try the editor, initiate remixes
- should have read-only access to search/discovery features
- should have read-only access to view published `Project`s
- should be able to initiate a "create account sequence"

#### Authenticated users
- should be able to create and save new `Project`s
- should be able to read, update, and delete all own `Project`s

#### Admins
- should be able to delete `Project`s by other users
- should be able to set "banned/removed" or "featured" status on `Project`s

## Data Model
- basic units are `Project`s, which are collections of `Page`s
- `Project`s:
  - are associated with a user (the creator)
  - contain **metadata** fields such as date created, date updated, title, description, etc.
  - have a **version**, indicating whether metadata is compatible with the current version of the app, which is auto-generated and read-only
  - have **privileged metadata**, such as featured or banned status, that is only editable by admin level accounts
  - are associated with a number of `Page`s
- `Page`s:
  - are associated with a `Project`
  - contain **metadata** fields indicating position, title, etc.
  - have **content**, which is a list of blocks.
  - have a **version** indicating whether metadata and  metadata of each block are compatible with the current version of the app, which is auto-generated and read-only
- if possible, `Project`s and `Page`s should be able to be migrated based on their version numbers.
- a more specific definition of this data model needs to be determined once design is finalized.

## API Requirements

### Project and Page API

Basic needs: retrieve and edit projects belonging to a user
Authentication: unauthed: no access; authed: read-write; admin: read-write

#### Project: Create/Read/Update/Delete/Copy projects
- create a new `Project`, return an ID
- retrieve a `Project` by ID, including all associated `Page`s
- update/delete a `Project` by ID
- we need to be able to undo deletions, but this could be handled by the front end. needs to be discussed.
- should store a "version" to ensure expected data fields exist for current state of App UI
- copy a `Project` including all associated `Page`s and associate with a new user ID

#### Page: Create/Read/Update/Delete/Copy
- create a new `Page`
- read/update/delete a `Page`
- should store a "version" to ensure expected data fields exist for current state of App UI
- copy a `Page` from one `Project` ID to another `Project` ID

#### List projects
- users should be able to retrieve a list of their `Project`s sorted on any field
- does not need to return associated `Page`s
- should support pagination
- could be part of the Discovery/Search API (see below)

### Discovery/Search API

Basic needs: retrieve featured `Project`s, search/filter all published projects
Authentication: unauthed: read-only; authed: read-only; admin: read-write

#### Featured projects
- should be able to filter by "release date", tag, locale, or version
- should support custom ordering
- should support pagination
- editable by "Admin" level accounts only

#### Search (not RCv1)
- not needed immediately, but we will need to search on various fields in app metadata and content, sort by date, filter by locale, etc.

#### Comments/favorites (not RCv1)
- not needed immediately, but this is something we want to support eventually

### Media Upload API

Basic needs: allow users to upload images (and possibly other binary assets) and attach them to a `Project`.

More detail is needed here.

### User API

Basic needs: allow users to edit their user profiles and access profile information of others.

More detail is needed here.

## Technical Decisions

#### Database
- what database? (mysql, postgres, ?)
- how do we handle migrations?

#### Server architecture
- what version of nodejs (0.10.x, 0.12.x, io.js)
- SQL strategy if needed (ORM, raw sql, etc.)
- framework?
- error handling?

#### Tests/CI
-

#### Monitoring/Analytics
-

### Ops
- production infrastructure needed
- dev infrastructure needed

(Add more)
