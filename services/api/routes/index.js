var public = require('./public');
var authenticated = require('./authenticated');
var routes = [];

public.concat(authenticated).forEach(function(route) {
  routes.push(route);
});

module.exports = routes;
