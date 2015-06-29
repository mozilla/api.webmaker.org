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
    url: '/users/1/projects/1/pages/1/elements/1',
    method: 'patch',
    payload: {
      styles: {}
    },
    headers: userToken
  }
};

exports.get = {
  all: {
    success: {
      manyElements:{
        url: '/users/1/projects/1/pages/1/elements',
        method: 'get'
      },
      noElements: {
        url: '/users/1/projects/1/pages/2/elements',
        method: 'get'
      }
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/99/projects/3/pages/1/elements',
            method: 'get'
          },
          notNumber: {
            url: '/users/cade/projects/1/pages/1/elements',
            method: 'get'
          },
          notInteger: {
            url: '/users/1.5/projects/1/pages/1/elements',
            method: 'get'
          },
          doesNotOwnProject: {
            url: '/users/1/projects/4/pages/1/elements',
            method: 'get'
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/89/pages/1/elements',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/coolproject/pages/1/elements',
            method: 'get'
          },
          notInteger: {
            url: '/users/1/projects/1.5/pages/1/elements',
            method: 'get'
          },
          pageNotInProject: {
            url: '/users/1/projects/1/pages/1/elements',
            method: 'get'
          }
        },
        page: {
          notFound: {
            url: '/users/1/projects/1/pages/87/elements',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/1/pages/foo/elements',
            method: 'get'
          },
          notInteger: {
            url: '/users/1/projects/1/pages/1.5/elements',
            method: 'get'
          }
        }
      },
      error: {
        url: '/users/1/projects/1/pages/1/elements',
        method: 'get'
      }
    }
  },
  one: {
    success: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'get'
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/99/projects/3/pages/1/elements/1',
            method: 'get',
            headers: userToken
          },
          notNumber: {
            url: '/users/cade/projects/1/pages/1/elements/1',
            method: 'get',
            headers: userToken
          },
          notInteger: {
            url: '/users/1.5/projects/1/pages/1/elements/1',
            method: 'get',
            headers: userToken
          },
          doesNotOwnProject: {
            url: '/users/1/projects/4/pages/1/elements/1',
            method: 'get',
            headers: userToken
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/89/pages/1/elements/1',
            method: 'get',
            headers: userToken
          },
          notNumber: {
            url: '/users/1/projects/coolproject/pages/1/elements/1',
            method: 'get',
            headers: userToken
          },
          notInteger: {
            url: '/users/1/projects/1.5/pages/1/elements/1',
            method: 'get',
            headers: userToken
          },
          pageNotInProject: {
            url: '/users/1/projects/1/pages/1/elements/1',
            method: 'get',
            headers: userToken
          }
        },
        page: {
          notFound: {
            url: '/users/1/projects/1/pages/87/elements/1',
            method: 'get',
            headers: userToken
          },
          notNumber: {
            url: '/users/1/projects/1/pages/foo/elements/1',
            method: 'get',
            headers: userToken
          },
          notInteger: {
            url: '/users/1/projects/1/pages/1.5/elements/1',
            method: 'get',
            headers: userToken
          }
        },
        element: {
          notFound: {
            url: '/users/1/projects/1/pages/1/elements/909',
            method: 'get',
            headers: userToken
          },
          notNumber: {
            url: '/users/1/projects/1/pages/1/elements/foo',
            method: 'get',
            headers: userToken
          },
          notInteger: {
            url: '/users/1/projects/1/pages/1/elements/1.5',
            method: 'get',
            headers: userToken
          }
        }
      },
      error: {
        url: '/users/1/projects/1/pages/1/elements/1',
        method: 'get'
      }
    }
  }
};

exports.create = {
  success: {
    emptyJSON: {
      url: '/users/1/projects/7/pages/6/elements',
      method: 'post',
      headers: userToken,
      payload: {
        type: 'text'
      }
    },
    withStyle: {
      url: '/users/1/projects/7/pages/6/elements',
      method: 'post',
      headers: userToken,
      payload: {
        type: 'text',
        styles: {
          color: '#FF0000'
        }
      }
    },
    withAttributes: {
      url: '/users/1/projects/7/pages/6/elements',
      method: 'post',
      headers: userToken,
      payload: {
        type: 'text',
        attributes: {
          value: 'hello world'
        }
      }
    }
  },
  fail: {
    params: {
      user: {
        notFound: {
          url: '/users/99/projects/3/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        notInteger: {
          url: '/users/1.5/projects/1/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        doesNotOwnProject: {
          url: '/users/1/projects/4/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/89/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        notNumber: {
          url: '/users/1/projects/coolproject/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        notInteger: {
          url: '/users/1/projects/1.5/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/87/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1.5/elements',
          method: 'post',
          headers: userToken,
          payload: { type: 'text' }
        }
      }
    },
    payload: {
      type: {
        notProvided: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: {}
        },
        notString: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: {
            type: 1
          }
        }
      },
      attributes: {
        notObject: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: {
            type: 'text',
            attributes: 'fail'
          }
        }
      },
      styles: {
        notObject: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'post',
          headers: userToken,
          payload: {
            type: 'text',
            styles: 'fail'
          }
        }
      }
    },
    error: {
      url: '/users/1/projects/1/pages/1/elements',
      method: 'post',
      headers: userToken,
      payload: {
        type: 'fail'
      }
    }
  }
};

exports.patch = {
  success: {
    onlyStyles: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'patch',
      headers: userToken,
      payload: {
        styles: {
          color: '#FF0000'
        }
      }
    },
    onlyAttributes: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'patch',
      headers: userToken,
      payload: {
        attributes: {
          value: 'hello world'
        }
      }
    },
    all: {
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
    }
  },
  fail: {
    params: {
      user: {
        notFound: {
          url: '/users/75/projects/1/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1.5/projects/1/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        doesNotOwnProject: {
          url: '/users/1/projects/4/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/75/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/foo/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1.5/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/7/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/87/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1.5/elements/1',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        elementNotInPage: {
          url: '/users/1/projects/1/pages/1/elements/8',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        }
      },
      element: {
        notFound: {
          url: '/users/1/projects/1/pages/1/elements/43',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/1/elements/foo',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1/elements/1.5',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        }
      }
    },
    payload: {
      attributes: {
        notObject: {
          url: '/users/1/projects/1/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: {
            attributes: 'foo'
          }
        }
      },
      styles: {
        notObject: {
          url: '/users/1/projects/1/pages/1/elements/1',
          method: 'patch',
          headers: userToken,
          payload: {
            styles: 'foo'
          }
        }
      },
      missingAll: {
        url: '/users/1/projects/1/pages/1/elements/1',
        method: 'patch',
        headers: userToken,
        payload: {}
      }
    },
    error: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'patch',
      headers: userToken,
      payload: {
        attributes: {}
      }
    }
  }
};

exports.del = {
  success: {
    owner: {
      url: '/users/2/projects/3/pages/7/elements/8',
      method: 'delete',
      headers: userToken2
    },
    moderator: {
      url: '/users/2/projects/3/pages/7/elements/9',
      method: 'delete',
      headers: moderatorToken
    }
  },
  fail: {
    params: {
      user: {
        notFound: {
          url: '/users/75/projects/1/pages/1/elements/1',
          method: 'delete',
          headers: userToken
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1/elements/1',
          method: 'delete',
          headers: userToken
        },
        notInteger: {
          url: '/users/3.1415/projects/1/pages/1/elements/1',
          method: 'delete',
          headers: userToken
        },
        doesNotOwnProject: {
          url: '/users/2/projects/3/pages/7/elements/10',
          method: 'delete',
          headers: userToken
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/75/pages/1/elements/1',
          method: 'delete',
          headers: userToken
        },
        notNumber: {
          url: '/users/1/projects/foo/pages/1/elements/1',
          method: 'delete',
          headers: userToken
        },
        notInteger: {
          url: '/users/1/projects/3.1415/pages/1/elements/1',
          method: 'delete',
          headers: userToken
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/7/elements/1',
          method: 'delete',
          headers: userToken
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/78/elements/1',
          method: 'delete',
          headers: userToken
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo/elements/1',
          method: 'delete',
          headers: userToken
        },
        notInteger: {
          url: '/users/1/projects/1/pages/3.1415/elements/1',
          method: 'delete',
          headers: userToken
        }
      },
      element: {
        notFound: {
          url: '/users/1/projects/1/pages/1/elements/43',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/1/elements/foo',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1/elements/1.5',
          method: 'patch',
          headers: userToken,
          payload: { styles: {} }
        }
      }
    },
    auth: {
      notOwner: {
        url: '/users/2/projects/3/pages/7/elements/10',
        method: 'delete',
        headers: userToken
      }
    },
    error: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'delete',
      headers: userToken
    }
  }
};

exports.options = {
  success: {
    url: '/users/1/projects/1/pages/1/elements/1',
    method: 'options'
  }
};
