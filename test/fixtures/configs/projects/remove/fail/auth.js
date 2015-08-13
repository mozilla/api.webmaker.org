exports.notOwner = {
  url: '/users/3/projects/5',
  method: 'delete',
  headers: {
    authorization: 'token userToken2'
  }
};
