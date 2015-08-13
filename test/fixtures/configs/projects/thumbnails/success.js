exports.update = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    x: 0
  }
};

exports.check = {
  url: '/users/1/projects/1'
};
