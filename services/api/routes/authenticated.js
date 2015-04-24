var Joi = require('joi');
var _ = require('lodash');

var authRouteConfig = {
  config: {
    cors: true,
    auth: {
      mode: 'required',
      strategies: ['token'],
      scope: 'skittles'
    }
  }
};

var routes = [
  {
    path: '/api/skittles',
    method: 'post',
    handler: require('../handlers/skittles'),
    config: {
      validate: {
        payload: {
          color: Joi.string().required()
        }
      },
      description: 'Create a skittle of your favorite color!'
    }
  }, {
    path: '/api/skittles/{id}',
    method: 'patch',
    handler: require('../handlers/skittles'),
    config: {
      validate: {
        payload: {
          color: Joi.string().required()
        },
        params: {
          id: Joi.number().required()
        }
      },
      description: 'Change a skittle\'s color'
    }
  }, {
    path: '/api/skittles/{id}',
    method: 'delete',
    handler: require('../handlers/skittles'),
    config: {
      validate: {
        params: {
          id: Joi.number().required()
        }
      },
      description: 'Eat a skittle'
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, authRouteConfig, route);
});

module.exports = routes;
