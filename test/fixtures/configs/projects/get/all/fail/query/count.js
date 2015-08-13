exports.negative = {
  url: '/projects?count=-1',
  method: 'get'
};

exports.tooHigh = {
  url: '/projects?count=101',
  method: 'get'
};

exports.notNumber = {
  url: '/projects?count=foo'
};
