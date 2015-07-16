module.exports = function mockValidator(token, callback) {
  callback(null, 200, {
    scope: ['projects'],
    id: 1
  });
};
