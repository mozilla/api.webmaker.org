var boom = require('boom');

exports.post = function(request, reply) {
  request.server.methods.elements.create(
    [
      request.pre.page.id,
      request.payload.type,
      JSON.stringify(request.payload.attributes),
      JSON.stringify(request.payload.styles)
    ],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

      reply({
        status: 'created',
        element: result.rows[0]
      });
    }
  );
};

exports.get = {
  all: function(request, reply) {
    request.server.methods.elements.findAll(
      [
        request.pre.page.id
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          elements: result.rows.map(function(el) {
            return request.server.methods.utils.formatElement(el);
          })
        });
      }
    );
  },
  one: function(request, reply) {
    request.server.methods.elements.findOne(
      [
        request.params.element,
        request.pre.page.id
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(boom.notFound('Element not found'));
        }

        reply({
          status: 'success',
          element: request.server.methods.utils.formatElement(result.rows[0])
        });
      }
    );
  }
};

exports.patch = {
  update: function(request, reply) {
    var attributes = request.payload.attributes;
    var styles = request.payload.styles;

    if ( !attributes ) {
      attributes = request.pre.element.attributes;
    }

    if ( !styles ) {
      styles = request.pre.element.styles;
    }

    request.server.methods.elements.update(
      [
        styles,
        attributes,
        request.params.element
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        var thumbTail = request.tail('updating project thumbnail');
        process.nextTick(function() {
          request.server.methods.projects.checkPageId(request.pre.page, thumbTail);
        });

        request.server.methods.cache.invalidateKey(
          'elements',
          'findAll',
          [request.params.page],
          request.tail('drop elements.findAll cache')
        );

        request.server.methods.cache.invalidateKey(
          'elements',
          'findOne',
          [request.params.element],
          request.tail('drop elements.findOne cache')
        );

        reply({
          status: 'updated',
          element: result.rows[0]
        });
      }
    );
  }
};

exports.del = function(request, reply) {
  request.server.methods.elements.remove(
    [
      request.params.element
    ],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

      request.server.methods.cache.invalidateKey(
        'elements',
        'findAll',
        [request.params.page],
        request.tail('drop elements.findAll cache')
      );

      request.server.methods.cache.invalidateKey(
        'elements',
        'findOne',
        [request.params.element],
        request.tail('drop elements.findOne cache')
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
