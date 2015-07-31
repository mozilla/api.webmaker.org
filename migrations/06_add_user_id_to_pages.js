exports.up = function(knex) {
  return knex.schema.table('pages', function(t) {
    t.bigInteger('user_id').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.table('pages', function(t) {
    t.dropColumn('user_id');
  });
};
