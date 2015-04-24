var Joi = require('joi');
var objectAssign = require('object-assign');

var publicRouteConfig = {
  config: {
    auth: false,
    cors: true
  }
};

var routes = [
  {
    path: '/api/skittles/{id}',
    method: 'GET',
    handler: require('../handlers/skittles'),
    config: {
      validate: {
        params: {
          id: Joi.number().required()
        }
      },
      description: 'Returns the skittle with the given id',
      notes: 'taste the rainbow'
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
      }
    }
  }
];

routes = routes.map(function(route) {
  return objectAssign({}, publicRouteConfig, route);
});

module.exports = routes;
