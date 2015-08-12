// catches failures if find user call fails
module.exports = {
  url: '/users/2',
  method: 'delete',
  headers: {
    authorization: 'token userToken2'
  }
};
