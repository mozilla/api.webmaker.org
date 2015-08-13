var userToken = {
  authorization: 'token userToken'
};

exports.title = {
  url: '/users/1/projects/1',
  method: 'patch',
  payload: {
    title: 123
  },
  headers: userToken
};

exports.thumb = {
  url: '/users/1/projects/1',
  method: 'patch',
  payload: {
    thumbnail: 123
  },
  headers: userToken
};

exports.thumbValue = {
  url: '/users/1/projects/1',
  method: 'patch',
  payload: {
    thumbnail: {
      320: 123
    }
  },
  headers: userToken
};

exports.thumbKey = {
  url: '/users/1/projects/1',
  method: 'patch',
  payload: {
    thumbnail: {
      2048: 'new'
    }
  },
  headers: userToken
};

exports.titleLength = {
  url: '/users/1/projects/1',
  method: 'patch',
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
