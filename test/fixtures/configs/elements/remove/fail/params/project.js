var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/75/pages/1/elements/1',
  method: 'delete',
  headers: userToken
};

exports.notNumber = {
  url: '/users/1/projects/foo/pages/1/elements/1',
  method: 'delete',
  headers: userToken
};

exports.notInteger = {
  url: '/users/1/projects/3.1415/pages/1/elements/1',
  method: 'delete',
  headers: userToken
};

exports.pageNotInProject = {
  url: '/users/1/projects/1/pages/7/elements/1',
  method: 'delete',
  headers: userToken
};
