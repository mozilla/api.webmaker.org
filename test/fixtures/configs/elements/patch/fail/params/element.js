var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/1/pages/1/elements/43',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/1/elements/foo',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/1/elements/1.5',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};
