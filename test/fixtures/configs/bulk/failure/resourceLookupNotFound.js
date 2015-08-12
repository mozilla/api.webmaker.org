// You can't update a project that doesn't exist
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
          id: 300,
          title: 'this project does not exist, therefore you can not update it'
        }
      }
    ]
  }
};
