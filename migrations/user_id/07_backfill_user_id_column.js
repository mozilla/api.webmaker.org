exports.up = function(knex) {
  knex('pages')
    .select('projects.user_id').as('user_id')
    .select('pages.id').as('page_id')
    .innerJoin('projects', function() {
      this.on('projects.id', '=', 'pages.project_id');
    });
};

exports.down = function(knex) {
};
