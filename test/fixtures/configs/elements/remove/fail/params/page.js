var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/1/pages/78/elements/1',
  method: 'delete',
  headers: userToken
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/foo/elements/1',
  method: 'delete',
  headers: userToken
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/3.1415/elements/1',
  method: 'delete',
  headers: userToken
};
