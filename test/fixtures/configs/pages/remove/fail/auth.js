exports.notOwner = {
  url: '/users/1/projects/1/pages/1',
  method: 'delete',
  headers: {
    authorization: 'token userToken2'
  }
};
