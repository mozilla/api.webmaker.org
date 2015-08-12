var userToken = {
  authorization: 'token userToken'
};

exports.onlyStyles = {
  url: '/users/1/projects/1/pages/1/elements/1',
  method: 'patch',
  headers: userToken,
  payload: {
    styles: {
      color: '#FF0000'
    }
  }
};

exports.onlyAttributes = {
  url: '/users/1/projects/1/pages/1/elements/1',
  method: 'patch',
  headers: userToken,
  payload: {
    attributes: {
      value: 'hello world'
    }
  }
};

exports.all = {
  url: '/users/1/projects/1/pages/1/elements/1',
  method: 'patch',
  headers: userToken,
  payload: {
    styles: {
      color: '#0000FF'
    },
    attributes: {
      value: 'world, hello'
    }
  }
};
