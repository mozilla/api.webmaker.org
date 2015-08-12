// 401 if fetching another users account row
module.exports = {
  url: '/users/2',
  method: 'get',
  headers: {
    authorization: 'token userToken'
  }
};
