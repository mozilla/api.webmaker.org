exports.create = {
  success: {
    url: '/users',
    method: 'post',
    payload: {
      username: 'newuser',
      language: 'en',
      country: 'CA'
    }
  },
  duplicateUsername: {
    url: '/users',
    method: 'post',
    payload: {
      username: 'newuser',
      language: 'en',
      country: 'CA'
    }
  }
};

exports.get = {
  success: {
    url: '/users/1',
    method: 'get',
    headers: {
      authorization: 'token userToken'
    }
  },
  invalidId: {
    url: '/users/90',
    method: 'get',
    headers: {
      authorization: 'token userToken'
    }
  },
  notYourAccount: {
    url: '/users/2',
    method: 'get',
    headers: {
      authorization: 'token userToken'
    }
  }
};

exports.patch = {
  updateEverything: {
    url: '/users/1',
    method: 'patch',
    headers: {
      authorization: 'token userToken'
    },
    payload: {
      username: 'changed',
      language: 'es',
      country: 'US'
    }
  },
  username: {
    url: '/users/1',
    method: 'patch',
    headers: {
      authorization: 'token userToken'
    },
    payload: {
      username: 'changedAgain'
    }
  },
  language: {
    url: '/users/1',
    method: 'patch',
    headers: {
      authorization: 'token userToken'
    },
    payload: {
      language: 'fr'
    }
  },
  userNotFound: {
    url: '/users/90',
    method: 'patch',
    headers: {
      authorization: 'token userToken'
    },
    payload: {
      username: 'error',
      language: 'es',
      country: 'US'
    }
  },
  unauthorized: {
    url: '/users/2',
    method: 'patch',
    headers: {
      authorization: 'token userToken'
    },
    payload: {
      username: 'changed',
      language: 'es',
      country: 'US'
    }
  },
  duplicateUsername: {
    url: '/users/2',
    method: 'patch',
    headers: {
      authorization: 'token userToken2'
    },
    payload: {
      username: 'changedAgain'
    }
  }
};

exports.del = {
  success: {
    url: '/users/1',
    method: 'delete',
    headers: {
      authorization: 'token userToken'
    }
  },
  userNotFound: {
    url: '/users/90',
    method: 'delete',
    headers: {
      authorization: 'token userToken'
    }
  },
  unauthorized: {
    url: '/users/3',
    method: 'delete',
    headers: {
      authorization: 'token userToken2'
    }
  },
  fail: {
    url: '/users/2',
    method: 'delete',
    headers: {
      authorization: 'token userToken2'
    }
  }, fail2: {
    url: '/users/3',
    method: 'delete',
    headers: {
      authorization: 'token moderatorToken'
    }
  }
};

exports.options = {
  success: {
    url: '/users/1',
    method: 'options',
    headers: {
      authorization: 'token userToken'
    }
  }
};
