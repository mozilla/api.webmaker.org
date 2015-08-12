var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/75/projects/1/pages/1/elements/1',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.notNumber = {
  url: '/users/cade/projects/1/pages/1/elements/1',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.notInteger = {
  url: '/users/1.5/projects/1/pages/1/elements/1',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.doesNotOwnProject = {
  url: '/users/1/projects/4/pages/1/elements/1',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};
