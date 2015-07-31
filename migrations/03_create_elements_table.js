exports.up = function(knex) {
  return knex.schema.hasTable('elements').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('elements', function(t) {
        t.bigIncrements('id').notNullable().primary();
        t.string('type').notNullable();
        t.bigInteger('page_id').references('id').inTable('pages');
        t.json('attributes', true).notNullable().defaultTo('{}');
        t.json('styles', true).notNullable().defaultTo('{}');

        t.timestamp('deleted_at').defaultTo(null);
        t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        t.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('elements');
};
