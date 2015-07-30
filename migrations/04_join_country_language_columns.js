'use strict';

exports.up = function(knex, Promise) {
  return knex.transaction(function(trx) {
    return knex('users').transacting(trx)
      //jscs:disable
      .update('language', knex.raw("concat(users.language, '-', users.country)"))
      .then(function() {
        return knex.raw('ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT \'en-US\'');
      })
      .then(trx.commit);
  });
};

exports.down = function(knex, Promise) {
  return knex.transation(function(trx) {
    return knex('users').transacting(trx)
      //jscs:disable
      .update('language', knex.raw("subtring(users.language, 1, 2)"))
      .then(function() {
        return knex.raw('ALTER TABLE "users" ALTER COLUMN "language" DROP DEFAULT');
      })
      .then(trx.commit);
  });
};
