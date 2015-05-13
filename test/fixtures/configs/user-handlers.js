exports.create = {
  success: {
    url: '/users',
    method: 'POST',
    payload: {
      username: 'newuser',
      language: 'en',
      country: 'CA'
    }
  },
  duplicateUsername: {
    url: '/users',
    method: 'POST',
    payload: {
      username: 'newuser',
      language: 'en',
      country: 'CA'
    }
  },
  noLang: {
    url: '/users',
    method: 'POST',
    payload: {
      username: 'newuser2',
      country: 'CA'
    }
  },
  noCountry: {
    url: '/users',
    method: 'POST',
    payload: {
      username: 'newuser3',
      language: 'en'
    }
  }
};

exports.get = {
  success: {
    url: '/users/1',
    method: 'GET',
    headers: {
      authorization: 'token userToken'
    }
  },
  invalidId: {
    url: '/users/90',
    method: 'GET',
    headers: {
      authorization: 'token userToken'
    }
  },
  notYourAccount: {
    url: '/users/2',
    method: 'GET',
    headers: {
      authorization: 'token userToken'
    }
  }
};

exports.patch = {
  updateEverything: {
    url: '/users/1',
    method: 'PATCH',
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
    method: 'PATCH',
    headers: {
      authorization: 'token userToken'
    },
    payload: {
      username: 'changedAgain'
    }
  },
  language: {
    url: '/users/1',
    method: 'PATCH',
    headers: {
      authorization: 'token userToken'
    },
    payload: {
      language: 'fr'
    }
  },
  userNotFound: {
    url: '/users/90',
    method: 'PATCH',
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
    method: 'PATCH',
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
    method: 'PATCH',
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
    method: 'DELETE',
    headers: {
      authorization: 'token userToken'
    }
  },
  userNotFound: {
    url: '/users/90',
    method: 'DELETE',
    headers: {
      authorization: 'token userToken'
    }
  },
  unauthorized: {
    url: '/users/3',
    method: 'DELETE',
    headers: {
      authorization: 'token userToken2'
    }
  },
  fail: {
    url: '/users/2',
    method: 'DELETE',
    headers: {
      authorization: 'token userToken2'
    }
  }, fail2: {
    url: '/users/3',
    method: 'DELETE',
    headers: {
      authorization: 'token moderatorToken'
    }
  }
};

exports.options = {
  success: {
    url: '/users/1',
    method: 'OPTIONS',
    headers: {
      authorization: 'token userToken'
    }
  }
};
