'use strict';

exports.up = function(knex, Promise) {
  return knex.transaction(function(trx) {
    return knex('users').transacting(trx)
      .update('language', knex.raw("concat(users.language, '-', users.country)"))
      .then(function() {
        return knex.raw('ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT \'en-US\'');
      })
      .then(trx.commit);
  })
};

exports.down = function(knex) {
};
