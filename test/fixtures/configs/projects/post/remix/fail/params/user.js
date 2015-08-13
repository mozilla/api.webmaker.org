var userToken = {
  authorization: 'token userToken'
};

exports.notNumber = {
  url: '/users/foo/projects/2/remixes',
  method: 'post',
  headers: userToken
};

exports.notFound = {
  url: '/users/467/projects/2/remixes',
  method: 'post',
  headers: userToken
};
