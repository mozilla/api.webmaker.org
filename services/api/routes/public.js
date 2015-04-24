var Joi = require('joi');
var _ = require('lodash');

var publicRouteConfig = {
  config: {
    auth: false,
    cors: true
  }
};

var skittlesHandler = require('../handlers/skittles');

var routes = [
  {
    path: '/api/skittles/{id}',
    method: ['GET', 'OPTIONS'],
    handler: skittlesHandler,
    config: {
      validate: {
        params: {
          id: Joi.number().required()
        }
      },
      cors: {
        methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS']
      },
      description: 'Returns the skittle with the given id',
      notes: 'taste the rainbow'
    }
  }, {
    path: '/api/skittles',
    method: 'OPTIONS',
    handler: skittlesHandler,
    config: {
      cors: {
        methods: ['POST', 'OPTIONS']
      },
      description: 'CORS options for /api/skittles'
    }
  }, {
    path: '/docs/css/style.css',
    method: 'GET',
    handler: {
      file: './node_modules/lout/public/css/style.css'
    },
    config: {
      plugins: {
        lout: false
      },
      cors: false
    }
  }, {
    path: '/',
    method: 'GET',
    handler: function(request, reply) {
      reply.redirect('/docs');
    },
    config: {
      plugins: {
        lout: false
      },
      cors: false
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, publicRouteConfig, route);
});

module.exports = routes;
