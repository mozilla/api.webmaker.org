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
          id: 1,
          title: 'test_project_1'
        }
      }
    ]
  }
};
