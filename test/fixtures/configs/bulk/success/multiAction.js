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
          title: 'bulk created'
        }
      },
      {
        type: 'pages',
        method: 'create',
        data: {
          projectId: '$0.id',
          x: 0,
          y: 1
        }
      },
      {
        type: 'elements',
        method: 'create',
        data: {
          pageId: '$1.id',
          type: 'text'
        }
      },
      {
        type: 'pages',
        method: 'update',
        data: {
          id: '$1.id',
          x: 1,
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
      },
      {
        type: 'pages',
        method: 'update',
        data: {
          id: '$4.id',
          x: 2,
          y: 0
        }
      },
      {
        type: 'projects',
        method: 'update',
        data: {
          id: '$0.id',
          title: 'change project title'
        }
      },
      {
        type: 'elements',
        method: 'update',
        data: {
          id: '$2.id'
        }
      },
      {
        type: 'elements',
        method: 'remove',
        data: {
          id: '$2.id'
        }
      },
      {
        type: 'pages',
        method: 'remove',
        data: {
          id: '$1.id'
        }
      },
      {
        type: 'pages',
        method: 'remove',
        data: {
          id: '$4.id'
        }
      },
      {
        type: 'projects',
        method: 'remove',
        data: {
          id: '$0.id'
        }
      }
    ]
  }
};
