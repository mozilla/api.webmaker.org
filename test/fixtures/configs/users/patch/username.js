// can update username
module.exports = {
  url: '/users/1',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    username: 'changedAgain'
  }
};
