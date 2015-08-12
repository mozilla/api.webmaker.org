// should not be able to udpate a project owned by another user
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
        method: 'update',
        data: {
          id: 3,
          title: 'you can not update this'
        }
      }
    ]
  }
};
