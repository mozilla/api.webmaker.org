exports.remix ={
  url: '/users/1/projects/1/remixes',
  method: 'post',
  headers: {
    authorization: 'token userToken2'
  }
};

exports.checkRemixProject = {
  url: '/users/2/projects/$1'
};

exports.checkRemixPages = {
  url: '/users/2/projects/$1/pages'
};

exports.newUserFromRemix = {
  url: '/users/1/projects/1/remixes',
  method: 'post',
  headers: {
    authorization: 'token newFromRemix'
  }
};
