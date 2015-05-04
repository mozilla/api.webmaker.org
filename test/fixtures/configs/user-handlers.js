exports.create = {
  success: {
    url: '/api/users',
    method: 'post',
    payload: {
      username: 'newuser',
      language: 'en',
      country: 'CA'
    }
  },
  duplicateUsername: {
    url: '/api/users',
    method: 'post',
    payload: {
      username: 'cade',
      language: 'en',
      country: 'CA'
    }
  },
  pgError: {
    url: '/api/users',
    method: 'post',
    payload: {
      username: 'error',
      language: 'en',
      country: 'CA'
    }
  }
};

exports.get = {
  success: {
    url: '/api/users/1',
    method: 'get',
    headers: {
      authorization: 'token validToken'
    }
  },
  invalidId: {
    url: '/api/users/4',
    method: 'get',
    headers: {
      authorization: 'token validToken'
    }
  },
  pgError: {
    url: '/api/users/5',
    method: 'get',
    headers: {
      authorization: 'token validToken'
    }
  },
  notYourAccount: {
    url: '/api/users/2',
    method: 'get',
    headers: {
      authorization: 'token validToken'
    }
  }
};

exports.patch = {
  updateEverything: {
    url: '/api/users/1',
    method: 'patch',
    headers: {
      authorization: 'token validToken'
    },
    payload: {
      username: 'changed',
      language: 'es',
      country: 'US'
    }
  },
  username: {
    url: '/api/users/1',
    method: 'patch',
    headers: {
      authorization: 'token validToken'
    },
    payload: {
      username: 'changedAgain'
    }
  },
  language: {
    url: '/api/users/1',
    method: 'patch',
    headers: {
      authorization: 'token validToken'
    },
    payload: {
      language: 'fr'
    }
  },
  pgFetchError: {
    url: '/api/users/5',
    method: 'patch',
    headers: {
      authorization: 'token validToken'
    },
    payload: {
      username: 'changed',
      language: 'es',
      country: 'US'
    }
  },
  pgUpdateError: {
    url: '/api/users/1',
    method: 'patch',
    headers: {
      authorization: 'token validToken'
    },
    payload: {
      username: 'error',
      language: 'es',
      country: 'US'
    }
  },
  userNotFound: {
    url: '/api/users/4',
    method: 'patch',
    headers: {
      authorization: 'token validToken'
    },
    payload: {
      username: 'error',
      language: 'es',
      country: 'US'
    }
  },
  unauthorized: {
    url: '/api/users/2',
    method: 'patch',
    headers: {
      authorization: 'token validToken'
    },
    payload: {
      username: 'changed',
      language: 'es',
      country: 'US'
    }
  }
};

exports.del = {
  success: {
    url: '/api/users/1',
    method: 'delete',
    headers: {
      authorization: 'token validToken'
    }
  },
  userNotFound: {
    url: '/api/users/4',
    method: 'delete',
    headers: {
      authorization: 'token validToken'
    }
  },
  pgFetchError: {
    url: '/api/users/5',
    method: 'delete',
    headers: {
      authorization: 'token validToken'
    }
  },
  pgDeleteError: {
    url: '/api/users/2',
    method: 'delete',
    headers: {
      authorization: 'token validToken2'
    }
  },
  unauthorized: {
    url: '/api/users/1',
    method: 'delete',
    headers: {
      authorization: 'token validToken2'
    }
  }
};

exports.options = {
  success: {
    url: '/api/users/1',
    method: 'options',
    headers: {
      authorization: 'token validToken'
    }
  }
};
