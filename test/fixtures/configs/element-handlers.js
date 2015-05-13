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
    method: 'PATCH',
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
        method: 'GET'
      },
      noElements: {
        url: '/users/1/projects/1/pages/2/elements',
        method: 'GET'
      }
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/99/projects/3/pages/1/elements',
            method: 'GET'
          },
          notNumber: {
            url: '/users/cade/projects/1/pages/1/elements',
            method: 'GET'
          },
          notInteger: {
            url: '/users/1.5/projects/1/pages/1/elements',
            method: 'GET'
          },
          doesNotOwnProject: {
            url: '/users/1/projects/4/pages/1/elements',
            method: 'GET'
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/89/pages/1/elements',
            method: 'GET'
          },
          notNumber: {
            url: '/users/1/projects/coolproject/pages/1/elements',
            method: 'GET'
          },
          notInteger: {
            url: '/users/1/projects/1.5/pages/1/elements',
            method: 'GET'
          },
          pageNotInProject: {
            url: '/users/1/projects/1/pages/1/elements',
            method: 'GET'
          }
        },
        page: {
          notFound: {
            url: '/users/1/projects/1/pages/87/elements',
            method: 'GET'
          },
          notNumber: {
            url: '/users/1/projects/1/pages/foo/elements',
            method: 'GET'
          },
          notInteger: {
            url: '/users/1/projects/1/pages/1.5/elements',
            method: 'GET'
          }
        }
      },
      error: {
        url: '/users/1/projects/1/pages/1/elements',
        method: 'GET'
      }
    }
  },
  one: {
    success: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'GET'
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/99/projects/3/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          },
          notNumber: {
            url: '/users/cade/projects/1/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          },
          notInteger: {
            url: '/users/1.5/projects/1/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          },
          doesNotOwnProject: {
            url: '/users/1/projects/4/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/89/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          },
          notNumber: {
            url: '/users/1/projects/coolproject/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          },
          notInteger: {
            url: '/users/1/projects/1.5/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          },
          pageNotInProject: {
            url: '/users/1/projects/1/pages/1/elements/1',
            method: 'GET',
            headers: userToken
          }
        },
        page: {
          notFound: {
            url: '/users/1/projects/1/pages/87/elements/1',
            method: 'GET',
            headers: userToken
          },
          notNumber: {
            url: '/users/1/projects/1/pages/foo/elements/1',
            method: 'GET',
            headers: userToken
          },
          notInteger: {
            url: '/users/1/projects/1/pages/1.5/elements/1',
            method: 'GET',
            headers: userToken
          }
        },
        element: {
          notFound: {
            url: '/users/1/projects/1/pages/1/elements/909',
            method: 'GET',
            headers: userToken
          },
          notNumber: {
            url: '/users/1/projects/1/pages/1/elements/foo',
            method: 'GET',
            headers: userToken
          },
          notInteger: {
            url: '/users/1/projects/1/pages/1/elements/1.5',
            method: 'GET',
            headers: userToken
          }
        }
      },
      error: {
        url: '/users/1/projects/1/pages/1/elements/1',
        method: 'GET'
      }
    }
  }
};

exports.create = {
  success: {
    emptyJSON: {
      url: '/users/1/projects/7/pages/6/elements',
      method: 'POST',
      headers: userToken,
      payload: {
        type: 'text'
      }
    },
    withStyle: {
      url: '/users/1/projects/7/pages/6/elements',
      method: 'POST',
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
      method: 'POST',
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
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        notInteger: {
          url: '/users/1.5/projects/1/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        doesNotOwnProject: {
          url: '/users/1/projects/4/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/89/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        notNumber: {
          url: '/users/1/projects/coolproject/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        notInteger: {
          url: '/users/1/projects/1.5/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/87/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1.5/elements',
          method: 'POST',
          headers: userToken,
          payload: { type: 'text' }
        }
      }
    },
    payload: {
      type: {
        notProvided: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: {}
        },
        notString: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'POST',
          headers: userToken,
          payload: {
            type: 1
          }
        }
      },
      attributes: {
        notObject: {
          url: '/users/1/projects/1/pages/1/elements',
          method: 'POST',
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
          method: 'POST',
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
      method: 'POST',
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
      method: 'PATCH',
      headers: userToken,
      payload: {
        styles: {
          color: '#FF0000'
        }
      }
    },
    onlyAttributes: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'PATCH',
      headers: userToken,
      payload: {
        attributes: {
          value: 'hello world'
        }
      }
    },
    all: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'PATCH',
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
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1.5/projects/1/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        doesNotOwnProject: {
          url: '/users/1/projects/4/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/75/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/foo/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1.5/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/7/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/87/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1.5/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        elementNotInPage: {
          url: '/users/1/projects/1/pages/1/elements/8',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        }
      },
      element: {
        notFound: {
          url: '/users/1/projects/1/pages/1/elements/43',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/1/elements/foo',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1/elements/1.5',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        }
      }
    },
    payload: {
      attributes: {
        notObject: {
          url: '/users/1/projects/1/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: {
            attributes: 'foo'
          }
        }
      },
      styles: {
        notObject: {
          url: '/users/1/projects/1/pages/1/elements/1',
          method: 'PATCH',
          headers: userToken,
          payload: {
            styles: 'foo'
          }
        }
      },
      missingAll: {
        url: '/users/1/projects/1/pages/1/elements/1',
        method: 'PATCH',
        headers: userToken,
        payload: {}
      }
    },
    error: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'PATCH',
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
      method: 'DELETE',
      headers: userToken2
    },
    moderator: {
      url: '/users/2/projects/3/pages/7/elements/9',
      method: 'DELETE',
      headers: moderatorToken
    }
  },
  fail: {
    params: {
      user: {
        notFound: {
          url: '/users/75/projects/1/pages/1/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        notNumber: {
          url: '/users/cade/projects/1/pages/1/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        notInteger: {
          url: '/users/3.1415/projects/1/pages/1/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        doesNotOwnProject: {
          url: '/users/1/projects/3/pages/1/elements/1',
          method: 'DELETE',
          headers: userToken
        }
      },
      project: {
        notFound: {
          url: '/users/1/projects/75/pages/1/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        notNumber: {
          url: '/users/1/projects/foo/pages/1/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        notInteger: {
          url: '/users/1/projects/3.1415/pages/1/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        pageNotInProject: {
          url: '/users/1/projects/1/pages/7/elements/1',
          method: 'DELETE',
          headers: userToken
        }
      },
      page: {
        notFound: {
          url: '/users/1/projects/1/pages/78/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        notNumber: {
          url: '/users/1/projects/1/pages/foo/elements/1',
          method: 'DELETE',
          headers: userToken
        },
        notInteger: {
          url: '/users/1/projects/1/pages/3.1415/elements/1',
          method: 'DELETE',
          headers: userToken
        }
      },
      element: {
        notFound: {
          url: '/users/1/projects/1/pages/1/elements/43',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notNumber: {
          url: '/users/1/projects/1/pages/1/elements/foo',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        },
        notInteger: {
          url: '/users/1/projects/1/pages/1/elements/1.5',
          method: 'PATCH',
          headers: userToken,
          payload: { styles: {} }
        }
      }
    },
    auth: {
      notOwner: {
        url: '/users/2/projects/3/pages/7/elements/10',
        method: 'DELETE',
        headers: userToken
      }
    },
    error: {
      url: '/users/1/projects/1/pages/1/elements/1',
      method: 'DELETE',
      headers: userToken
    }
  }
};

exports.options = {
  success: {
    url: '/users/1/projects/1/pages/1/elements/1',
    method: 'OPTIONS'
  }
};
