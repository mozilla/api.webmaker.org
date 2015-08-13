var userToken = {
  authorization: 'token userToken'
};

exports.title = {
  url: '/users/1/projects/1',
  method: 'patch',
  payload: {
    title: 'new'
  },
  headers: userToken
};

exports.withThumbnailKey = {
  url: '/users/1/projects/1',
  method: 'patch',
  payload: {
    title: 'newww',
    thumbnail: {
      '320': 'will not work'
    }
  },
  headers: userToken
};
