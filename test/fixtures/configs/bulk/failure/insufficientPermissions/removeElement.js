module.exports = {
  url: '/users/1/bulk',
  method: 'post',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    actions: [
      {
        type: 'elements',
        method: 'remove',
        data: {
          id: 11
        }
      }
    ]
  }
};
