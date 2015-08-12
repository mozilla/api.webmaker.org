var userToken = {
  authorization: 'token userToken'
};

exports.onlyX = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    x: 12
  }
};

exports.onlyY = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    y: 12
  }
};

exports.onlyStyles = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    styles: {
      color: '#00FF00'
    }
  }
};

exports.all = {
  url: '/users/1/projects/1/pages/1',
  method: 'patch',
  headers: userToken,
  payload: {
    x: 10,
    y: 10,
    styles: {
      color: '#0000FF'
    }
  }
};
