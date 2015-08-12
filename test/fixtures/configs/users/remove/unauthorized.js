// can't delete another account
module.exports = {
  url: '/users/3',
  method: 'delete',
  headers: {
    authorization: 'token userToken2'
  }
};
