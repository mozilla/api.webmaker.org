exports.notFound = {
  url: '/users/99/projects/3/pages/1',
  method: 'get'
};

exports.notNumber = {
  url: '/users/cade/projects/1/pages/1',
  method: 'get'
};

exports.notInteger = {
  url: '/users/1.5/projects/1/pages/1',
  method: 'get'
};

exports.doesNotOwnProject = {
  url: '/users/1/projects/4/pages/1',
  method: 'get'
};
