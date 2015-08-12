// doesn't allow duplicate user ids
module.exports = {
  url: '/users',
  method: 'post',
  headers: {
    authorization: 'token createToken1'
  }
};
