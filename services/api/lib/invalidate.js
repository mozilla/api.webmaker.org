var _ = require('lodash');

var ROUTES = {
  '/users/{user}/projects/{project}': {
    methods: ['patch', 'delete'],
    group: 'projects',
    invalidate: [{
      func: 'findOne',
      args: function(request) {
        return request.paramsArray.reverse();
      }
    }]
  },
  '/users/{user}/projects/{project}/feature': {
    methods: ['patch'],
    group: 'projects',
    invalidate: [{
      funcName: 'findOne',
      args: function(request) {
        return request.paramsArray.reverse();
      }
    }]
  },
  '/users/{user}/projects/{project}/pages/{page}': {
    methods: ['patch', 'delete'],
    group: 'pages',
    invalidate: [{
      funcName: 'findOne',
      args: function(request) {
        return request.paramsArray.slice(1);
      }
    }, {
      funcName: 'findAll',
      args: function(request) {
        return [request.params.project];
      }
    }]
  },
  '/users/{user}/projects/{project}/pages/{page}/elements/{element}': {
    methods: ['patch', 'delete'],
    group: 'elements',
    invalidate: [{
      funcName: 'findOne',
      args: function(request) {
        return request.paramsArray.slice(2).reverse();
      }
    }, {
      funcName: 'findAll',
      args: function(request) {
        return [request.params.page];
      }
    }]
  }
};

exports.register = function(server, options, done) {
  server.on('response', function(request, event, tags) {
    if ( request.response.statusCode !== 200 ) {
      return;
    }

    var route = ROUTES[request.route.path];
    if ( !route ) {
      return;
    }

    var method = _.find(route.methods, request.route.method);
    if ( !method ) {
      return;
    }

    route.invalidate.forEach(function(invalidate) {
      server.methods[route.group][invalidate.funcName]
        .cache.drop(invalidate.args(request), function(err) {
        if ( err ) {
          server.log('error', err);
        }
      });
    });
  });
  done();
};

exports.register.attributes = {
  name: 'webmaker-cache-invalidator',
  version: '1.0.0'
};
