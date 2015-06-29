var boom = require('boom');

function invalidateCache(server, type, funcName, key, tail) {
  server.methods[type][funcName].cache.drop(key, function(err) {
    if ( err ) {
      server.log('error', {
        message: 'failed to invalidate cache for ' + type + '.' + funcName + ', ' + key,
        error: err
      });
    }
    tail();
  });
}

exports.post = {
  create: function(request, reply) {
    request.server.methods.pages.create(
      [
        request.pre.project.id,
        request.payload.x,
        request.payload.y,
        JSON.stringify(request.payload.styles)
      ],
      function(err, result) {
        if ( err ) {
          if ( err.constraint === 'pages_xyid_unique_idx' ) {
            return reply(boom.badRequest('Duplicate coordinates'));
          }
          return reply(err);
        }

        var findOneProjectCache = request.tail('invalidate findOne project cache');
        process.nextTick(function() {
          invalidateCache(
            request.server,
            'projects',
            'findOne',
            [request.params.project, request.params.user],
            findOneProjectCache
          );
        });

        reply({
          status: 'created',
          page: request.server.methods.utils.formatPage(result.rows)
        });
      }
    );
  }
};

exports.get = {
  all: function(request, reply) {
    request.server.methods.pages.findAll(
      [
        request.pre.project.id
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          pages: request.server.methods.utils.formatPages(result.rows)
        });
      }
    );
  },
  one: function(request, reply) {
    request.server.methods.pages.findOne(
      [
        request.pre.project.id,
        request.params.page
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(boom.notFound('Page not found'));
        }

        reply({
          status: 'success',
          page: request.server.methods.utils.formatPage(result.rows)
        });
      }
    );
  }
};

exports.patch = {
  update: function(request, reply) {
    var styles = request.payload.styles;
    var x = request.payload.x;
    var y = request.payload.y;

    if ( !x ) {
      x = request.pre.page.x;
    }

    if ( !y ) {
      y = request.pre.page.y;
    }

    if ( !styles ) {
      styles = request.pre.page.styles;
    }

    request.server.methods.pages.update(
      [
        x,
        y,
        JSON.stringify(styles),
        request.params.page
      ],
      function(err, result) {
        if ( err ) {
          if ( err.constraint === 'pages_xyid_unique_idx' ) {
            return reply(boom.badRequest('Duplicate coordinates'));
          }
          return reply(err);
        }

        var page = request.server.methods.utils.formatPage(result.rows);
        var thumbTail = request.tail('updating project thumbnail');
        process.nextTick(function() {
          request.server.methods.projects.checkPageId(page, thumbTail);
        });

        var findAllCache = request.tail('invalidate findAll page cache');
        process.nextTick(function() {
          invalidateCache(request.server, 'pages', 'findAll', [request.params.project], findAllCache);
        });

        var findOneCache = request.tail('invalidate findOne page cache');
        process.nextTick(function() {
          invalidateCache(request.server, 'pages', 'findOne', [request.params.project, page.id], findOneCache);
        });

        reply({
          status: 'updated',
          page: page
        });
      }
    );
  }
};

exports.del = function(request, reply) {
  request.server.methods.pages.remove(
    [
      request.params.page
    ],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

      var findAllCache = request.tail('invalidate findAll page cache');
      process.nextTick(function() {
        invalidateCache(request.server, 'pages', 'findAll', [request.params.project], findAllCache);
      });

      var findOneCache = request.tail('invalidate findOne page cache');
      process.nextTick(function() {
        invalidateCache(
          request.server,
          'pages',
          'findOne',
          [request.params.project, request.params.page],
          findOneCache
        );
      });

      var findOneProjectCache = request.tail('invalidate findOne project cache');
      process.nextTick(function() {
        invalidateCache(
          request.server,
          'projects',
          'findOne',
          [request.params.project, request.params.user],
          findOneProjectCache
        );
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
