var Joi = require('joi');
var objectAssign = require('object-assign');

var authRouteConfig = {
  config: {
    cors: true
  }
};

var routes = [
  {
    path: '/api/skittles',
    method: 'post',
    handler: require('../handlers/skittles'),
    config: {
      description: 'create a skittle',
      validate: {
        payload: {
          color: Joi.string().required()
        }
      }
    }
  }, {
    path: '/api/skittles/{id}',
    method: 'patch',
    handler: require('../handlers/skittles'),
    config: {
      description: 'Update a skittle\'s color',
      validate: {
        payload: {
          color: Joi.string().required()
        },
        params: {
          id: Joi.number().required()
        }
      }
    }
  }, {
    path: '/api/skittles/{id}',
    method: 'delete',
    handler: require('../handlers/skittles'),
    config: {
      description: 'Eat a skittle',
      validate: {
        params: {
          id: Joi.number().required()
        }
      }
    }
  }
];

routes = routes.map(function(route) {
  return objectAssign({}, authRouteConfig, route);
});

module.exports = routes;
