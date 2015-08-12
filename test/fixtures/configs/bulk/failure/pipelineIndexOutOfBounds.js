module.exports = {
  url: '/users/1/bulk',
  method: 'post',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    actions: [
      {
        type: 'projects',
        method: 'create',
        data: {
          title: 'out of bounds project'
        }
      },
      {
        type: 'pages',
        method: 'create',
        data: {
          projectId: '$6.id',
          x: 0,
          y: 0
        }
      }
    ]
  }
};
