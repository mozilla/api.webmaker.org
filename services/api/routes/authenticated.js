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
    method: 'POST',
    handler: require('../handlers/skittles'),
    config: {
      description: 'create a skittle',
      validate: {
        payload: {
          color: Joi.string().required()
        }
      }
    }
  }
];

routes = routes.map(function(route) {
  return objectAssign({}, authRouteConfig, route);
});

module.exports = routes;
