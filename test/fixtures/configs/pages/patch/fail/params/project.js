var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/75/pages/1',
  method: 'patch',
  headers: userToken,
  payload: { x: 1 }
};

exports.notNumber = {
  url: '/users/1/projects/foo/pages/1',
  method: 'patch',
  headers: userToken,
  payload: { x: 1 }
};

exports.notInteger = {
  url: '/users/1/projects/1.5/pages/1',
  method: 'patch',
  headers: userToken,
  payload: { x: 1 }
};

exports.pageNotInProject = {
  url: '/users/1/projects/1/pages/7',
  method: 'patch',
  headers: userToken,
  payload: { x: 1 }
};
