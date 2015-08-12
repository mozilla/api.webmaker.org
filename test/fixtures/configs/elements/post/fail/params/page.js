var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/1/pages/87/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/foo/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/1.5/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};
