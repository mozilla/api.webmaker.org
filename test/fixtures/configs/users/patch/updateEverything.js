// can update username and language
module.exports = {
  url: '/users/1',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    username: 'changed',
    language: 'es-US'
  }
};
