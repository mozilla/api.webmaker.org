var userToken = {
  authorization: 'token userToken'
};

exports.title = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 123,
    thumbnail: {
      320: 'https://example.com/image.png'
    }
  },
  headers: userToken
};

exports.titleLength = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title' +
           'This is a really long title',
    thumbnail: {
      320: 'https://example.com/image.png'
    }
  },
  headers: userToken
};

exports.thumb = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 'bad_thumb',
    thumbnail: 'https://example.com/image.png'
  },
  headers: userToken
};

exports.thumbValue = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 'bad_thumb',
    thumbnail: {
      320: 123
    }
  },
  headers: userToken
};

exports.thumbKey = {
  url: '/users/1/projects',
  method: 'post',
  payload: {
    title: 'bad_thumb',
    thumbnail: {
      2048: 'https://example.com/image.png'
    }
  },
  headers: userToken
};
