exports.notFound = {
  url: '/users/1/projects/89/pages/1/elements',
  method: 'get'
};

exports.notNumber = {
  url: '/users/1/projects/coolproject/pages/1/elements',
  method: 'get'
};

exports.notInteger = {
  url: '/users/1/projects/1.5/pages/1/elements',
  method: 'get'
};

exports.pageNotInProject = {
  url: '/users/1/projects/1/pages/1/elements',
  method: 'get'
};
