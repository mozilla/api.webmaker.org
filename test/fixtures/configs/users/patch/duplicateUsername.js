// can't update username to one that already exists
module.exports = {
  url: '/users/2',
  method: 'patch',
  headers: {
    authorization: 'token userToken2'
  },
  payload: {
    username: 'changedAgain'
  }
};
