var userToken = {
  authorization: 'token userToken'
};

var userToken2 = {
  authorization: 'token userToken2'
};

var moderatorToken = {
  authorization: 'token moderatorToken'
};

exports.prerequisites = {
  fail: {
    url: '/users/1/projects/1/pages/1',
    method: 'patch',
    payload: {
      x: 4
    },
    headers: userToken
  }
};

exports.get = {
  all: {
    success: {
      manyPages:{
        url: '/users/1/projects/1/pages',
        method: 'get'
      },
      noPages: {
        url: '/users/1/projects/2/pages',
        method: 'get'
      }
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/99/projects/3/pages',
            method: 'get'
          },
          notNumber: {
            url: '/users/cade/projects/1/pages',
            method: 'get'
          },
          notInteger: {
            url: '/users/1.5/projects/1/pages',
            method: 'get'
          },
          doesNotOwnProject: {
            url: '/users/1/projects/4/pages',
            method: 'get'
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/89/pages',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/coolproject/pages',
            method: 'get'
          },
          notInteger: {
            url: '/users/1/projects/1.5/pages',
            method: 'get'
          }
        }
      },
      error: {
        url: '/users/1/projects/1/pages',
        method: 'get'
      }
    }
  },
  one: {
    success: {
      pageWithElements: {
        url: '/users/1/projects/1/pages/1',
        method: 'get'
      },
      pageWithoutElements: {
        url: '/users/1/projects/1/pages/2',
        method: 'get'
      }
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/99/projects/3/pages/1',
            method: 'get'
          },
          notNumber: {
            url: '/users/cade/projects/1/pages/1',
            method: 'get'
          },
          notInteger: {
            url: '/users/1.5/projects/1/pages/1',
            method: 'get'
          },
          doesNotOwnProject: {
            url: '/users/1/projects/4/pages/1',
            method: 'get'
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/89/pages/1',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/coolproject/pages/1',
            method: 'get'
          },
          notInteger: {
            url: '/users/1/projects/1.5/pages/1',
            method: 'get'
          },
          pageNotInProject: {
            url: '/users/1/projects/1/pages/8',
            method: 'get'
          }
        },
        page: {
          notFound: {
            url: '/users/1/projects/1/pages/9001',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/1/pages/applesauce',
            method: 'get'
          },
          notInteger: {
            url: '/users/1/projects/1/pages/1.5',
            method: 'get'
          }
        }
      },
      error: {
        url: '/users/1/projects/1/pages/1',
        method: 'get'
      }
    }
  }
};

exports.create = {
  success: {
    emptyStyles: {
      url: '/users/1/projects/2/pages',
      method: 'post',
      headers: userToken,
      payload: {
        x: 0,
        y: 0
      }
    },
    withStyle: {
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
    },
    negativeXY: {
      url: '/users/1/projects/2/pages',
      method: 'post',
      headers: userToken,
      payload: {
        x: -1,
        y: -1
      }
    },
    deletedXY: {
      url: '/users/1/projects/2/pages',
      method: 'post',
      headers: userToken,
      payload: {
        x: 10,
        y: 10
      }
    }
  },
  fail: {
    params: {
      user: {
        notFound: {
          url: '/users/99/projects/3/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 5,
            y: 5
          }
        },
        notNumber: {
          url: '/users/cade/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 5,
            y: 5
          }
        },
        notInteger: {
          url: '/users/1.5/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 5,
            y: 5
          }
        },
        doesNotOwnProject: {
          url: '/users/1/projects/4/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 5,
            y: 5
          }
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/89/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 5,
            y: 5
          }
        },
        notNumber: {
          url: '/users/1/projects/coolproject/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 5,
            y: 5
          }
        },
        notInteger: {
          url: '/users/1/projects/1.5/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 5,
            y: 5
          }
        }
      }
    },
    payload: {
      x: {
        notProvided: {
          url: '/users/1/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            y: 1
          }
        },
        notNumber: {
          url: '/users/1/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 'foo',
            y: 1
          }
        },
        notInteger: {
          url: '/users/1/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 1.5,
            y: 1
          }
        }
      },
      y: {
        notProvided: {
          url: '/users/1/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 1
          }
        },
        notNumber: {
          url: '/users/1/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 1,
            y: 'foo'
          }
        },
        notInteger: {
          url: '/users/1/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 1,
            y: 1.5
          }
        }
      },
      xy: {
        duplicateCoords: {
          url: '/users/1/projects/2/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x:0,
            y:0
          }
        }
      },
      styles: {
        notObject: {
          url: '/users/1/projects/1/pages',
          method: 'post',
          headers: userToken,
          payload: {
            x: 1,
            y: 1,
            styles: 9001
          }
        }
      }
    },
    auth: {
      wrongUser: {
        url: '/users/1/projects/1/pages',
        method: 'post',
        headers: userToken2,
        payload: {
          x: 2,
          y: 2
        }
      }
    },
    error: {
      url: '/users/1/projects/1/pages',
      method: 'post',
      headers: userToken,
      payload: {
        x: 3,
        y: 3
      }
    }
  }
};

exports.patch = {
  success: {
    onlyX: {
      url: '/users/1/projects/1/pages/1',
      method: 'patch',
      headers: userToken,
      payload: {
        x: 12
      }
    },
    onlyY: {
      url: '/users/1/projects/1/pages/1',
      method: 'patch',
      headers: userToken,
      payload: {
        y: 12
      }
    },
    onlyStyles: {
      url: '/users/1/projects/1/pages/1',
      method: 'patch',
      headers: userToken,
      payload: {
        styles: {
          color: '#00FF00'
        }
      }
    },
    all: {
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
    }
  },
  fail: {
    params: {
      user: {
        notFound: {
          url: '/users/75/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        notInteger: {
          url: '/users/1.5/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        doesNotOwnProject: {
          url: '/users/1/projects/4/pages/1',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/75/pages/1',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        notNumber: {
          url: '/users/1/projects/foo/pages/1',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        notInteger: {
          url: '/users/1/projects/1.5/pages/1',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/7',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/87',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1.5',
          method: 'patch',
          headers: userToken,
          payload: { x: 1 }
        }
      }
    },
    payload: {
      x: {
        notNumber: {
          url: '/users/1/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: {
            x: 'foo'
          }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: {
            x: 1.5
          }
        }
      },
      y: {
        notNumber: {
          url: '/users/1/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: {
            y: 'foo'
          }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: {
            y: 1.5
          }
        }
      },
      xy: {
        duplicateCoords: {
          url: '/users/1/projects/1/pages/2',
          method: 'patch',
          headers: userToken,
          payload: {
            x: 1,
            y: 0
          }
        }
      },
      styles: {
        notObject: {
          url: '/users/1/projects/1/pages/1',
          method: 'patch',
          headers: userToken,
          payload: {
            styles: 'foo'
          }
        }
      },
      missingAll: {
        url: '/users/1/projects/1/pages/1',
        method: 'patch',
        headers: userToken,
        payload: {}
      }
    },
    error: {
      url: '/users/1/projects/1/pages/1',
      method: 'patch',
      headers: userToken,
      payload: {
        x: 25
      }
    }
  }
};

exports.del = {
  success: {
    owner: {
      url: '/users/1/projects/1/pages/1',
      method: 'delete',
      headers: userToken
    },
    moderator: {
      url: '/users/1/projects/1/pages/2',
      method: 'delete',
      headers: moderatorToken
    }
  },
  fail: {
    params: {
      user: {
        notFound: {
          url: '/users/75/projects/1/pages/1',
          method: 'delete',
          headers: userToken
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1',
          method: 'delete',
          headers: userToken
        },
        notInteger: {
          url: '/users/3.1415/projects/1/pages/1',
          method: 'delete',
          headers: userToken
        },
        doesNotOwnProject: {
          url: '/users/1/projects/3/pages/1',
          method: 'delete',
          headers: userToken
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/75/pages/1',
          method: 'delete',
          headers: userToken
        },
        notNumber: {
          url: '/users/1/projects/foo/pages/1',
          method: 'delete',
          headers: userToken
        },
        notInteger: {
          url: '/users/1/projects/3.1415/pages/1',
          method: 'delete',
          headers: userToken
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/7',
          method: 'delete',
          headers: userToken
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/1',
          method: 'delete',
          headers: userToken
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo',
          method: 'delete',
          headers: userToken
        },
        notInteger: {
          url: '/users/1/projects/1/pages/3.1415',
          method: 'delete',
          headers: userToken
        }
      }
    },
    auth: {
      notOwner: {
        url: '/users/1/projects/1/pages/3',
        method: 'delete',
        headers: userToken2
      }
    },
    error: {
      url: '/users/1/projects/1/pages/3',
      method: 'delete',
      headers: userToken
    }
  }
};

exports.options = {
  success: {
    url: '/users/1/projects/1/pages/1',
    method: 'options'
  }
};
