var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/1/pages/87',
  method: 'patch',
  headers: userToken,
  payload: { x: 1 }
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/foo',
  method: 'patch',
  headers: userToken,
  payload: { x: 1 }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/1.5',
  method: 'patch',
  headers: userToken,
  payload: { x: 1 }
};
