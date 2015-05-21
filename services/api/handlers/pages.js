var boom = require('boom');

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

        reply({
          status: 'updated',
          page: request.server.methods.utils.formatPage(result.rows)
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

      reply({
        status: 'deleted'
      });
    }
  );
};

exports.options = function(request, reply) {
  reply();
};
