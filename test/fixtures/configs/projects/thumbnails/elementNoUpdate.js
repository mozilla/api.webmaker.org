exports.update = {
  url: '/users/1/projects/1/pages/4/elements/27',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    attributes: {
      text: 'foo'
    }
  }
};

exports.check = {
  url: '/users/1/projects/1'
};
