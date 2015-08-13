var moderatorToken = {
  authorization: 'token moderatorToken'
};

exports.notFound = {
  url: '/users/90/projects/1/feature',
  method: 'patch',
  headers: moderatorToken
};

exports.notNumber = {
  url: '/users/foo/projects/1/feature',
  method: 'patch',
  headers: moderatorToken
};
