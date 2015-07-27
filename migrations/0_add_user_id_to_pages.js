exports.up = function(knex) {
  return knex.schema.table('pages', function(t) {
    t.integer('user_id').notNullable().references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.table('pages', function(t) {
    t.dropColumn('user_id');
  });
}
