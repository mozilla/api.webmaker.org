exports.notFound = {
  url: '/users/1/projects/1/pages/87/elements/1',
  method: 'get'
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/foo/elements/1',
  method: 'get'
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/1.5/elements/1',
  method: 'get'
};
