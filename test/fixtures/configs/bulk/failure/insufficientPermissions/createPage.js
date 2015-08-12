// should not be able to create a page in a project owned by another user
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
        method: 'create',
        data: {
          projectId: 3,
          x: 123,
          y: 456
        }
      }
    ]
  }
};
