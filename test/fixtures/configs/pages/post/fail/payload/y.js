var userToken = {
  authorization: 'token userToken'
};

exports.notProvided = {
  url: '/users/1/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 1
  }
};

exports.notNumber = {
  url: '/users/1/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 1,
    y: 'foo'
  }
};

exports.notInteger = {
  url: '/users/1/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 1,
    y: 1.5
  }
};
