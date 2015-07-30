exports.up = function(knex) {
  knex.schema.hasTable('projects').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('projects', function(t) {
        t.bigIncrements('id');
        t.bigInteger('user_id').references('id').inTable('users');
        t.bigInteger('remixed_from').defaultTo(null);
        t.string('version').notNullable();
        t.string('title').notNullable();
        t.boolean('featured').notNullable().defaultTo(false);
        t.json('thumbnail', true).notNullable().defaultTo('{}');

        t.timestamp('deleted_at').defaultTo(null);
        t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        t.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('projects');
};
