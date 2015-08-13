var moderatorToken = {
  authorization: 'token moderatorToken'
};

exports.feature = {
  url: '/users/1/projects/1/feature',
  method: 'patch',
  headers: moderatorToken
};

exports.unfeature = {
  url: '/users/2/projects/4/feature',
  method: 'patch',
  headers: moderatorToken
};
