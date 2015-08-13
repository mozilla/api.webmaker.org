exports.doesNotExist = {
  url: '/projects/999999999',
  method: 'get'
};

exports.badIdType = {
  url: '/projects/a',
  method: 'get'
};

exports.internalError = {
  url: '/projects/1',
  method: 'get'
};
