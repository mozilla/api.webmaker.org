// 404's if a user isn't found
module.exports = {
  url: '/users/90',
  method: 'delete',
  headers: {
    authorization: 'token userToken'
  }
};
