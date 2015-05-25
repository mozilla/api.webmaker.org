module.exports = function(validateFunc) {
  return {
    validateFunc: validateFunc,
    allowQueryToken: false,
    tokenType: 'token'
  };
};
