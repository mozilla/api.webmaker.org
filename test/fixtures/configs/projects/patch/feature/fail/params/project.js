var moderatorToken = {
  authorization: 'token moderatorToken'
};

exports.notFound = {
  url: '/users/1/projects/90/feature',
  method: 'patch',
  headers: moderatorToken
};

exports.notNumber = {
  url: '/users/1/projects/foo/feature',
  method: 'patch',
  headers: moderatorToken
};
