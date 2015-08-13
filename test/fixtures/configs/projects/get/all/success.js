exports.default = {
  url: '/projects',
  method: 'get'
};

exports.changeCount = {
  url: '/projects?count=3',
  method: 'get'
};

exports.changePage = {
  url: '/projects?count=3&page=2',
  method: 'get'
};

exports.returnsNoneWhenPageTooHigh = {
  url: '/projects?count=50&page=2',
  method: 'get'
};
