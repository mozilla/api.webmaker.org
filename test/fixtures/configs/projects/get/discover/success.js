exports.default = {
  url: '/discover',
  method: 'get'
};

exports.changeCount = {
  url: '/discover?count=3',
  method: 'get'
};

exports.changePage = {
  url: '/discover?count=3&page=2',
  method: 'get'
};

exports.returnsNoneWhenPageTooHigh = {
  url: '/discover?count=50&page=2',
  method: 'get'
};
