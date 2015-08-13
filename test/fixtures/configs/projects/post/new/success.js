var userToken = {
  authorization: 'token userToken'
};

exports.withoutThumbnail = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 'create_test'
  },
  headers: userToken
};

exports.withThumbnail = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 'create_test2',
    thumbnail: {
      320: 'https://example.com/image.png'
    }
  },
  headers: userToken
};

exports.userFromToken = {
  url: '/users/45/projects',
  method: 'post',
  payload: {
    title: 'new_from_token'
  },
  headers: {
    authorization: 'token newFromToken'
  }
};
