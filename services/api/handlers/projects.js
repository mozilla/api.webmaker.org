var boom = require('boom');

exports.post = {
  create: function(request, reply) {
    request.server.methods.projects.create(
      [
        request.params.user,
        null,
        request.server.methods.utils.version(),
        request.payload.title,
        JSON.stringify(request.payload.thumbnail)
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        request.server.methods.cache.invalidateKeys(
          'projects',
          'findUsersProjects',
          request.params.user,
          request.tail('drop projects.findUsersProjects cache')
        );

        reply({
          status: 'created',
          project: request.server.methods.utils.formatProject(result.project),
          page: request.server.methods.utils.formatPage(result.page)
        });
      }
    );
  },
  remix: function(request, reply) {
    request.server.methods.projects.remix(
      request.pre.tokenUser.id,
      request.pre.remixData,
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'remixed',
          project: request.server.methods.utils.formatProject(result)
        });
      }
    );
  }
};

exports.get = {
  one: function(request, reply) {
    request.server.methods.projects.findOne(
      [
        request.params.project,
        request.params.user
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(boom.notFound('Project not found'));
        }

        reply({
          status: 'success',
          project: request.server.methods.utils.formatProject(result.rows[0])
        });
      }
    );
  },
  all: function(request, reply) {
    request.server.methods.projects.findAll(
      [
        request.query.count,
        request.pre.offset
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          projects: result.rows.map(function(project) {
            return request.server.methods.utils.formatProject(project);
          })
        });
      }
    );
  },
  allByUser: function(request, reply) {
    request.server.methods.projects.findUsersProjects(
      [
        request.params.user,
        request.query.count,
        request.pre.offset
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          projects: result.rows.map(function(project) {
            return request.server.methods.utils.formatProject(project);
          })
        });
      }
    );
  },
  remixes: function(request, reply) {
    request.server.methods.projects.findRemixes(
      [
        request.params.project,
        request.query.count,
        request.pre.offset
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          projects: result.rows.map(function(project) {
            return request.server.methods.utils.formatProject(project);
          })
        });
      }
    );
  },
  featured: function(request, reply) {
    request.server.methods.projects.findFeatured(
      [
        request.query.count,
        request.pre.offset
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          projects: result.rows.map(function(project) {
            return request.server.methods.utils.formatProject(project);
          })
        });
      }
    );
  },
  featuredByLanguage: function(request, reply) {
    request.server.methods.projects.findFeaturedByLanguage(
      [
        request.params.language,
        request.query.count,
        request.pre.offset
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          projects: result.rows.map(function(project) {
            return request.server.methods.utils.formatProject(project);
          })
        });
      }
    );
  }
};

exports.patch = {
  update: function(request, reply) {
    request.server.methods.projects.update(
      [
        request.payload.title,
        request.params.project
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        request.server.methods.cache.invalidateKey(
          'projects',
          'findOne',
          [request.params.project, request.params.user],
          request.tail('drop projects.findOne cache')
        );

        request.server.methods.cache.invalidateKeys(
          'projects',
          'findUsersProjects',
          request.params.user,
          request.tail('drop projects.findUsersProjects cache')
        );

        reply({
          status: 'updated',
          project: request.server.methods.utils.formatProject(result.rows[0])
        });
      }
    );
  },
  feature: function(request, reply) {
    request.server.methods.projects.feature(
      [
        !request.pre.project.featured,
        request.pre.project.id
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        request.server.methods.cache.invalidateKeys(
          'projects',
          'findFeatured',
          request.tail('drop projects.findFeatured cache')
        );

        reply({
          status: 'updated',
          project: request.server.methods.utils.formatProject(result.rows[0])
        });
      }
    );
  }
};

exports.del = function(request, reply) {
  request.server.methods.projects.remove(
    [
      request.params.project
    ],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

      request.server.methods.cache.invalidateKey(
        'projects',
        'findOne',
        [request.params.project, request.params.user],
        request.tail('drop projects.findOne cache')
      );

      request.server.methods.cache.invalidateKeys(
        'projects',
        'findUsersProjects',
        request.params.user,
        request.tail('drop projects.findUsersProjects cache')
      );

      reply({
        status: 'deleted'
      });
    }
  );
};

exports.options = function(request, reply) {
  reply();
};
