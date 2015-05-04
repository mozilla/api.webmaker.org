var Joi = require('joi');
var _ = require('lodash');

var authRouteConfig = {
  config: {
    auth: {
      mode: 'required',
      strategies: ['token']
    }
  }
};

var usersHandler = require('../handlers/users');

var routes = [
  {
    path: '/api/users/{user}',
    method: ['options', 'get', 'delete'],
    handler: usersHandler,
    config: {
      auth: {
        scope: 'user'
      },
      validate: {
        params: {
          user: Joi.number().required()
        }
      },
      cors: {
        methods: ['options', 'get', 'patch', 'delete']
      }
    }
  }, {
    path: '/api/users/{user}',
    method: 'patch',
    handler: usersHandler,
    config: {
      auth: {
        scope: 'user'
      },
      validate: {
        params: {
          user: Joi.number().required()
        },
        payload: {
          username: Joi.string().max(20).optional(),
          language: Joi.string().length(2).optional(),
          country: Joi.string().length(2).optional()
        }
      },
      cors: {
        methods: ['options', 'get', 'patch', 'delete']
      }
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, route, authRouteConfig);
});

module.exports = routes;
