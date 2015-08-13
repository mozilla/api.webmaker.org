exports.negative = {
  url: '/users/1/projects?count=-1'
};

exports.tooHigh = {
  url: '/users/1/projects?count=101'
};

exports.notNumber = {
  url: '/users/1/projects?count=foo'
};
