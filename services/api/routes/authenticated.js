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

var users = require('../handlers/users');

var routes = [
  {
    path: '/api/users/{user}',
    method: 'get',
    handler: users.get,
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
    handler: users.patch,
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
  }, {
    path: '/api/users/{user}',
    method: 'delete',
    handler: users.del,
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
    method: 'options',
    handler: users.options,
    config: {
      auth: {
        scope: 'user'
      },
      cors: {
        methods: ['options', 'get', 'patch', 'delete']
      },
      plugins: {
        lout: false
      }
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, route, authRouteConfig);
});

module.exports = routes;
