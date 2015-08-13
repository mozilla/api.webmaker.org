var userToken = {
  authorization: 'token userToken'
};

exports.notNumber = {
  url: '/users/foo/projects/2',
  method: 'delete',
  headers: userToken
};

exports.notFound = {
  url: '/users/458/projects/2',
  method: 'delete',
  headers: userToken
};
