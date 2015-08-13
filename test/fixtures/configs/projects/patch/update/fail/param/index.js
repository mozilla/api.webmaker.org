var userToken = {
  authorization: 'token userToken'
};

exports.user = {
  url: '/users/cade/projects/1',
  method: 'patch',
  payload: {
    title: 'new2'
  },
  headers: userToken
};

exports.project = {
  url: '/users/1/projects/wat',
  method: 'patch',
  payload: {
    title: 'new2'
  },
  headers: userToken
};
