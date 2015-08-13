exports.default = {
  url: '/users/1/projects',
  method: 'get'
};

exports.changeCount = {
  url: '/users/1/projects?count=3',
  method: 'get'
};

exports.changePage = {
  url: '/users/1/projects?count=2&page=2',
  method: 'get'
};

exports.returnsNoneWhenPageTooHigh = {
  url: '/users/1/projects?count=50&page=2',
  method: 'get'
};
