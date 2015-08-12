var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/1/pages/89',
  method: 'delete',
  headers: userToken
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/foo',
  method: 'delete',
  headers: userToken
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/3.1415',
  method: 'delete',
  headers: userToken
};
