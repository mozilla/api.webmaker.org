exports.owner = {
  url: '/users/1/projects/1/pages/2',
  method: 'delete',
  headers: {
    authorization: 'token userToken'
  }
};

exports.moderator = {
  url: '/users/1/projects/1/pages/3',
  method: 'delete',
  headers: {
    authorization: 'token moderatorToken'
  }
};
