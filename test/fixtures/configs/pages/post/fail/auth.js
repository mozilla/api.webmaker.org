exports.wrongUser = {
  url: '/users/1/projects/1/pages',
  method: 'post',
  headers: {
    authorization: 'token userToken2'
  },
  payload: {
    x: 2,
    y: 2
  }
};
