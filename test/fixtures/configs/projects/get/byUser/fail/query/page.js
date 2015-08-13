exports.negative = {
  url: '/users/1/projects?page=-1'
};

exports.tooHigh = {
  url: '/users/1/projects?page=51'
};

exports.notNumber = {
  url: '/users/1/projects?page=foo'
};
