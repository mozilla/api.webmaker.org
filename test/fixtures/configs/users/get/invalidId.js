// 404 if user not found
module.exports = {
  url: '/users/90',
  method: 'get',
  headers: {
    authorization: 'token userToken'
  }
};
