// should not be able to update an element owned by another user
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
        method: 'update',
        data: {
          id: 11,
          attributes: {
            some: 'value'
          }
        }
      }
    ]
  }
};
