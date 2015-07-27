module.exports = [
  require('scooter'),
  {
    register: require('blankie'),
    options: require('../lib/csp')
  },
  require('lout'),
  require('hapi-auth-bearer-token'),
  require('hapi-version'),
  {
    register: require('bassmaster'),
    options: {
      batchEndpoint: '/batch'
    }
  }
];
