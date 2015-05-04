var _ = require('lodash');
var pub = require('./public');
var authenticated = require('./authenticated');
var routes = [];

pub.concat(authenticated).forEach(function(route) {
  routes.push(route);
});

// Convenience method for tests
routes.at = function(name) {
  return _.find(this, function(route) {
    return name === route.method + ' ' + route.path;
  });
};

module.exports = routes;
