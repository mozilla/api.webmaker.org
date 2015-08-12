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
          title: 'bad reference to the results of this action'
        }
      },
      {
        type: 'pages',
        method: 'create',
        data: {
          projectId: '$0.not.here',
          x: 0,
          y: 0
        }
      }
    ]
  }
};
