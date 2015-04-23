var objectAssign = require('object-assign');

var publicRouteConfig = {
  config: {
    auth: false,
    cors: true
  }
};

var routes = [
  {
    path: '/api/skittles',
    method: 'GET',
    handler: require('../handlers/skittles'),
    config: {
      description: 'Returns all the skittles',
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
