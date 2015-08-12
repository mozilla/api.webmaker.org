// should not be able to create an element in a page not owned by the user
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
        method: 'create',
        data: {
          pageId: 7,
          type: 'text',
          styles: {},
          attributes: {}
        }
      }
    ]
  }
};
