exports.negative = {
  url: '/users/1/projects/1/remixes?count=-1'
};

exports.tooHigh = {
  url: '/users/1/projects/1/remixes?count=101'
};

exports.notNumber = {
  url: '/users/1/projects/1/remixes?count=foo'
};
