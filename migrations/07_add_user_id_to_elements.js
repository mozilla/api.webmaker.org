exports.up = function(knex) {
  return knex.schema.table('elements', function(t) {
    t.integer('user_id').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.table('elements', function(t) {
    t.dropColumn('user_id');
  });
};
