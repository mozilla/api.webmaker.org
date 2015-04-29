module.exports = [
  require('scooter'),
  {
    register: require('blankie'),
    options: require('../lib/csp')
  },
  require('lout'),
  {
    register: require('hapi-auth-bearer-token'),
    options: require('../lib/auth-config')
  }
];
