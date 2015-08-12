var userToken = {
  authorization: 'token userToken'
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    x: 'foo'
  }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    x: 1.5
  }
};
