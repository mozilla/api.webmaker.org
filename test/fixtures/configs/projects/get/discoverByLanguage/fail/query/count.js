exports.negative = {
  url: '/discover?count=-1',
  method: 'get'
};

exports.tooHigh = {
  url: '/discover?count=101',
  method: 'get'
};

exports.notNumber = {
  url: '/discover?count=foo'
};
