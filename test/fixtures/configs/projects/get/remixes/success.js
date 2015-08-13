exports.default = {
  url: '/users/1/projects/1/remixes'
};

exports.changeCount = {
  url: '/users/1/projects/1/remixes?count=3'
};

exports.changePage = {
  url: '/users/1/projects/1/remixes?count=2&page=2'
};

exports.returnsNoneWhenPageTooHigh = {
  url: '/users/1/projects/1/remixes?count=50&page=2'
};
