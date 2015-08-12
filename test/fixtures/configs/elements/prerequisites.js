// handles errors if the getElement prerequisite fails
exports.fail = {
  url: '/users/1/projects/1/pages/1/elements/1',
  method: 'patch',
  payload: {
    styles: {}
  },
  headers: {
    authorization: 'token userToken'
  }
};
