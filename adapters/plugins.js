module.exports = [
  require('scooter'),
  {
    register: require('blankie'),
    options: require('../lib/csp')
  },
  require('hapi-auth-bearer-token'),
  require('hapi-version'),
  require('inert')
];
