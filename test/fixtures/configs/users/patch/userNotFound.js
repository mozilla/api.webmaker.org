// 404s if user not found when updating
module.exports = {
  url: '/users/90',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    username: 'error',
    language: 'es-US'
  }
};
