// can't update another user account
module.exports = {
  url: '/users/2',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    username: 'changed',
    language: 'es-US'
  }
};
