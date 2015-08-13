var userToken = {
  authorization: 'token userToken'
};

exports.notNumber = {
  url: '/users/foo/projects',
  method: 'post',
  payload: {
    title: 'bad_param',
    thumbnail: {
      320: 'https://example.com/image.png'
    }
  },
  headers: userToken
};

exports.notFound = {
  url: '/users/56/projects',
  method: 'post',
  payload: {
    title: 'bad_param',
    thumbnail: {
      320: 'https://example.com/image.png'
    }
  },
  headers: userToken
};
