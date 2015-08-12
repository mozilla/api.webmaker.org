var userToken = {
  authorization: 'token userToken'
};

exports.emptyJSON = {
  url: '/users/1/projects/7/pages/6/elements',
  method: 'post',
  headers: userToken,
  payload: {
    type: 'text'
  }
};

exports.withStyle = {
  url: '/users/1/projects/7/pages/6/elements',
  method: 'post',
  headers: userToken,
  payload: {
    type: 'text',
    styles: {
      color: '#FF0000'
    }
  }
};

exports.withAttributes = {
  url: '/users/1/projects/7/pages/6/elements',
  method: 'post',
  headers: userToken,
  payload: {
    type: 'text',
    attributes: {
      value: 'hello world'
    }
  }
};
