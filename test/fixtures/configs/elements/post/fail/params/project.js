var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/89/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.notNumber = {
  url: '/users/1/projects/coolproject/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.notInteger = {
  url: '/users/1/projects/1.5/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};

exports.pageNotInProject = {
  url: '/users/1/projects/1/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: { type: 'text' }
};
