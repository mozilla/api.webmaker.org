var Joi = require('joi');
var _ = require('lodash');

var publicRouteConfig = {
  config: {
    auth: false
  }
};

var users = require('../handlers/users');

var routes = [
  {
    path: '/api/users',
    method: 'post',
    handler: users.post,
    config: {
      validate: {
        payload: {
          username: Joi.string().required(),
          language: Joi.string().length(2).optional(),
          country: Joi.string().length(2).optional()
        }
      },
      cors: {
        methods: ['post', 'options']
      },
      description: 'Create a user account'
    }
  }, {
    path: '/api/users',
    method: 'options',
    handler: users.options,
    config: {
      cors: {
        methods: ['post', 'options']
      },
      plugins: {
        lout: false
      }
    }
  }, {
    path: '/docs/css/style.css',
    method: 'get',
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
    method: 'get',
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
