// can update language
module.exports = {
  url: '/users/1',
  method: 'patch',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    language: 'fr-CA'
  }
};
