var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/1/pages/87/elements/1',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/foo/elements/1',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/1.5/elements/1',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};

exports.elementNotInPage = {
  url: '/users/1/projects/1/pages/1/elements/8',
  method: 'patch',
  headers: userToken,
  payload: { styles: {} }
};
