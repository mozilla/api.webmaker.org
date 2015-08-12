var userToken = {
  authorization: 'token userToken'
};

exports.emptyStyles = {
  url: '/users/1/projects/2/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 0,
    y: 0
  }
};

exports.withStyle = {
  url: '/users/1/projects/2/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 0,
    y: 1,
    styles: {
      color: '#FF0000'
    }
  }
};

exports.negativeXY = {
  url: '/users/1/projects/2/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: -1,
    y: -1
  }
};

exports.deletedXY = {
  url: '/users/1/projects/2/pages',
  method: 'post',
  headers: userToken,
  payload: {
    x: 10,
    y: 10
  }
};
