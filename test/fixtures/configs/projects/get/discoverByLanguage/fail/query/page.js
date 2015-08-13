exports.negative = {
  url: '/discover?page=-1',
  method: 'get'
};

exports.tooHigh = {
  url: '/discover?page=51',
  method: 'get'
};

exports.notNumber = {
  url: '/discover?page=foo'
};
