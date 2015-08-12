var userToken = {
  authorization: 'token userToken'
};

exports.notProvided = {
  url: '/users/1/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    y: 1
  }
};

exports.notNumber = {
  url: '/users/1/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 'foo',
    y: 1
  }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 1.5,
    y: 1
  }
};
