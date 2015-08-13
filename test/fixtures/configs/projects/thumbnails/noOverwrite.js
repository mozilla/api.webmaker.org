var userToken = {
  authorization: 'token userToken'
};

exports.update = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    x: 5
  }
};

exports.updateTitle = {
  url: '/users/1/projects/1',
  method: 'patch',
  payload: {
    title: 'foo'
  },
  headers: userToken
};

exports.check = {
  url: '/users/1/projects/1'
};
