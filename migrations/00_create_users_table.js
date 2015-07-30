'use strict';

exports.up = function(knex) {
  knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(t) {
        t.bigIncrements('id').notNullable();
        t.string('username').unique().notNullable();
        t.string('language').notNullable().defaultTo('en');
        t.string('country').notNullable().defaultTo('US');
        t.boolean('moderator').notNullable().defaultTo(false);
        t.boolean('staff').notNullable().defaultTo(false);

        t.timestamp('deleted_at').defaultTo(null);
        t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        t.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
