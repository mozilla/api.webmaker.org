var userToken = {
  authorization: 'token userToken'
};

exports.notNumber = {
  url: '/users/1/projects/foo',
  method: 'delete',
  headers: userToken
};

exports.notFound = {
  url: '/users/1/projects/7',
  method: 'delete',
  headers: userToken
};
