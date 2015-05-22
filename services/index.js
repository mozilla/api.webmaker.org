module.exports = [
  {
    register: require('./api'),
    options: {
      pgNative: process.env.PG_NATIVE === 'true'
    }
  }
];
