var userToken = {
  authorization: 'token userToken'
};

exports.error = {
  url: '/users/1/projects/1/remixes',
  method: 'post',
  headers: userToken
};

exports.findDataForRemix = {
  url: '/users/1/projects/1/remixes',
  method: 'post',
  headers: userToken
};

exports.newUserFromRemix = {
  url: '/users/1/projects/1/remixes',
  method: 'post',
  headers: {
    authorization: 'token newFromRemix2'
  }
};
