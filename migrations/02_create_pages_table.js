exports.up = function(knex) {
  return knex.schema.createTable('pages', function(t) {
    t.bigIncrements('id').notNullable();
    t.bigInteger('project_id').references('id').inTable('projects');
    t.integer('x').notNullable();
    t.integer('y').notNullable();
    t.json('styles', true).defaultTo('{}');

    t.timestamp('deleted_at').defaultTo(null);
    t.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    t.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pages');
};
