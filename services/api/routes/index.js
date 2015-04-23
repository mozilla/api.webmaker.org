var pub = require('./public');
var authenticated = require('./authenticated');
var routes = [];

pub.concat(authenticated).forEach(function(route) {
  routes.push(route);
});

module.exports = routes;
