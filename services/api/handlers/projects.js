var boom = require('boom');

function invalidateProjectCache(server, funcName, keys, tail) {
  server.methods.projects[funcName].cache.drop(keys, function(err) {
    if ( err ) {
      server.log('error', {
        message: 'failed to invalidate cache for project key ' + keys.join('.'),
        error: err
      });
    }
    tail();
  });
}

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

        var findUsersProjectsTail = request.tail();
        process.nextTick(function() {
          invalidateProjectCache(
            request.server,
            'findUsersProjects',
            [request.params.project, '*', '*'],
            findUsersProjectsTail
          );
        });

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
        request.pre.limit,
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

        var findOneTail = request.tail();
        process.nextTick(function() {
          invalidateProjectCache(
            request.server,
            'findOne',
            [request.params.project, request.params.user],
            findOneTail
          );
        });

        var findUsersProjectsTail = request.tail();
        process.nextTick(function() {
          invalidateProjectCache(
            request.server,
            'findUsersProjects',
            [request.params.project, '*', '*'],
            findUsersProjectsTail
          );
        });

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

        var tail = request.tail();
        process.nextTick(function() {
          invalidateProjectCache(request.server, 'findFeatured', ['*', '*'], tail);
        });

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

      var findOneTail = request.tail();
      process.nextTick(function() {
        invalidateProjectCache(request.server, 'findOne', [request.params.project, request.params.user], findOneTail);
      });

      var findUsersProjectsTail = request.tail();
      process.nextTick(function() {
        invalidateProjectCache(request.server, 'findUsersProjects', [request.params.project], findUsersProjectsTail);
      });

      reply({
        status: 'deleted'
      });
    }
  );
};

exports.options = function(request, reply) {
  reply();
};
