var userToken = {
  authorization: 'token userToken'
};

exports.notFound = {
  url: '/users/99/projects/3/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 5,
    y: 5
  }
};

exports.notNumber = {
  url: '/users/cade/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 5,
    y: 5
  }
};

exports.notInteger = {
  url: '/users/1.5/projects/1/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 5,
    y: 5
  }
};

exports.doesNotOwnProject = {
  url: '/users/1/projects/4/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 5,
    y: 5
  }
};
