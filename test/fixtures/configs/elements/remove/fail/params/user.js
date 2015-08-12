var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/75/projects/1/pages/1/elements/1',
  method: 'delete',
  headers: userToken
};

exports.notNumber = {
  url: '/users/cade/projects/1/pages/1/elements/1',
  method: 'delete',
  headers: userToken
};

exports.notInteger = {
  url: '/users/3.1415/projects/1/pages/1/elements/1',
  method: 'delete',
  headers: userToken
};

exports.doesNotOwnProject = {
  url: '/users/2/projects/3/pages/7/elements/10',
  method: 'delete',
  headers: userToken
};
