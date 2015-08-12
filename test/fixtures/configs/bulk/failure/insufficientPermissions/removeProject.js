// should not be able to remove a project owned by another user
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
        method: 'remove',
        data: {
          id: 3
        }
      }
    ]
  }
};
