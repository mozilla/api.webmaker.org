exports.notObject = {
  url: '/users/1/projects/1/pages/1/elements',
  method: 'post',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    type: 'text',
    attributes: 'fail'
  }
};
