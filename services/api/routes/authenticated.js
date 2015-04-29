var Joi = require('joi');
var _ = require('lodash');

var authRouteConfig = {
  config: {
    auth: {
      mode: 'required',
      strategies: ['token'],
      scope: 'skittles'
    },
    cors: true
  }
};

var skittlesHandler = require('../handlers/skittles');

var routes = [
  {
    path: '/api/skittles',
    method: 'POST',
    handler: skittlesHandler,
    config: {
      validate: {
        payload: {
          color: Joi.string().required()
        }
      },
      cors: {
        methods: ['POST', 'OPTIONS']
      },
      description: 'Create a skittle of your favorite color!'
    }
  }, {
    path: '/api/skittles/{id}',
    method: 'patch',
    handler: skittlesHandler,
    config: {
      validate: {
        payload: {
          color: Joi.string().required()
        },
        params: {
          id: Joi.number().required()
        }
      },
      cors: {
        methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS']
      },
      description: 'Change a skittle\'s color'
    }
  }, {
    path: '/api/skittles/{id}',
    method: 'delete',
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
      description: 'Eat a skittle'
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, authRouteConfig, route);
});

module.exports = routes;
