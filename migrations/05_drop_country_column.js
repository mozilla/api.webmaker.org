exports.up = function(knex) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('country');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(t) {
    t.string('country');
  });
};
