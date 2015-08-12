// should not be able to update a page owned by another user
module.exports = {
  url: '/users/1/bulk',
  method: 'post',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    actions: [
      {
        type: 'pages',
        method: 'update',
        data: {
          id: 7,
          x: 123,
          y: 456
        }
      }
    ]
  }
};
