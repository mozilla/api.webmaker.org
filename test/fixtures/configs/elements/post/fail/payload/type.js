var userToken = {
  authorization: 'token userToken'
};

exports.notProvided = {
  url: '/users/1/projects/1/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: {}
};

exports.notString = {
  url: '/users/1/projects/1/pages/1/elements',
  method: 'post',
  headers: userToken,
  payload: {
    type: 1
  }
};
