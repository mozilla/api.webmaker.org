var userToken = {
  authorization: 'token userToken'
};

exports.notNumber = {
  url: '/users/1/projects/foo/remixes',
  method: 'post',
  headers: userToken
};

exports.notFound = {
  url: '/users/1/projects/2334/remixes',
  method: 'post',
  headers: userToken
};
