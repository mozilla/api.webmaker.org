var userToken = {
  authorization: 'token userToken'
};

exports.notNumber = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    y: 'foo'
  }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    y: 1.5
  }
};
