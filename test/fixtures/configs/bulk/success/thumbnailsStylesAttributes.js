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
          title: 'title',
          thumbnail: {
            '320': 'https://example.com/img.png'
          }
        }
      },
      {
        type: 'pages',
        method: 'create',
        data: {
          projectId: '$0.id',
          x: 0,
          y: 0,
          styles: {}
        }
      },
      {
        type: 'elements',
        method: 'create',
        data: {
          pageId: '$1.id',
          type: 'text',
          styles: {},
          attributes: {}
        }
      },
      {
        type: 'pages',
        method: 'update',
        data: {
          id: '$1.id',
          x: 1,
          y: 0,
          styles: {}
        }
      },
      {
        type: 'elements',
        method: 'update',
        data: {
          id: '$2.id',
          styles: {},
          attributes: {}
        }
      }
    ]
  }
};
