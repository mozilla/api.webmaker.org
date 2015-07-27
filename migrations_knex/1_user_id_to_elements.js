exports.up = function(knex) {
  return knex.schema.table('elements', function(t) {
    t.integer('user_id').notNullable().references('id').inTable('users');
  });
};

exports.down = funciton(knex) {
  return knex.schema.table('elements', function(t) {
    t.dropColumn('user_id');
  });
}
