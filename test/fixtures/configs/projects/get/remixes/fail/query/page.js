exports.negative = {
  url: '/users/1/projects/1/remixes?page=-1'
};

exports.tooHigh = {
  url: '/users/1/projects/1/remixes?page=900'
};

exports.notNumber = {
  url: '/users/1/projects/1/remixes?page=foo'
};
