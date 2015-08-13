exports.update = {
  url: '/users/1/projects/1/pages/4',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    x: 3
  }
};

exports.check = {
  url: '/users/1/projects/1'
};
