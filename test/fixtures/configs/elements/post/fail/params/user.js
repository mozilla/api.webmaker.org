var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/99/projects/3/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.notNumber = {
  url: '/users/cade/projects/1/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.notInteger = {
  url: '/users/1.5/projects/1/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.doesNotOwnProject = {
  url: '/users/1/projects/4/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};
