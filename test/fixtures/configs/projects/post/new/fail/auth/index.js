exports.wrongUser = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 'bad_param',
    thumbnail: {
      320: 'https://example.com/image.png'
    }
  },
  headers: {
    authorization: 'token userToken2'
  }
};

exports.userFromToken = {
  url: '/users/46/projects',
  method: 'post',
  payload: {
    title: 'new_from_token'
  },
  headers: {
    authorization: 'token newFromToken2'
  }
};
