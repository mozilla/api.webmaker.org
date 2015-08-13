exports.negative = {
  url: '/projects?page=-1',
  method: 'get'
};

exports.tooHigh = {
  url: '/projects?page=51',
  method: 'get'
};

exports.notNumber = {
  url: '/projects?page=foo'
};
