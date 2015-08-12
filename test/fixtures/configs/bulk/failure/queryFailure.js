// Can catch and report exceptions if a query fails to execute for any reason
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
          title: 'queryFailure'
        }
      },
      {
        type: 'pages',
        method: 'create',
        data: {
          projectId: '$0.id',
          x: 0,
          y: 0
        }
      },
      {
        type: 'pages',
        method: 'create',
        data: {
          projectId: '$0.id',
          x: 0,
          y: 0
        }
      }
    ]
  }
};
