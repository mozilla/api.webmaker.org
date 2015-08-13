var userToken = {
  authorization: 'token userToken'
};

module.exports = {
  fail: {
    url: '/discover',
    method: 'get'
  },
  createFail: {
    url: '/users/1/projects',
    method: 'post',
    payload: {
      title: 'create_test'
    },
    headers: userToken
  },
  remixFail: {
    url: '/users/1/projects/1/remixes',
    method: 'post',
    headers: userToken
  }
};
