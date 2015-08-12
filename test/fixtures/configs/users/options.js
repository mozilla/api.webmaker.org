// responds to options requests
module.exports = {
  success: {
    url: '/users/1',
    method: 'options',
    headers: {
      authorization: 'token userToken'
    }
  }
};
