var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/1/projects/89/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 5,
    y: 5
  }
};

exports.notNumber = {
  url: '/users/1/projects/coolproject/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 5,
    y: 5
  }
};

exports.notInteger = {
  url: '/users/1/projects/1.5/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 5,
    y: 5
  }
};
