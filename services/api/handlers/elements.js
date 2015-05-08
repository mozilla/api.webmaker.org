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
        request.params.element
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply({
          status: 'success',
          page: request.server.methods.utils.formatElement(result.rows[0])
        });
      }
    );
  }
};

exports.patch = function(request, reply) {
  request.server.methods.elements.update(
    [
      request.payload.attributes,
      request.payload.styles,
      request.params.element
    ],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

      reply({
        status: 'updated',
        page: result.rows[0]
      });
    }
  );
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

      reply({
        status: 'deleted'
      });
    }
  );
};

exports.options = function(request, reply) {
  reply();
};
