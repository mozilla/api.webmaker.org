exports.owner = {
  url: '/users/1/projects/7',
  method: 'delete',
  headers: {
    authorization: 'token userToken'
  }
};

exports.moderator = {
  url: '/users/1/projects/2',
  method: 'delete',
  headers: {
    authorization: 'token moderatorToken'
  }
};
