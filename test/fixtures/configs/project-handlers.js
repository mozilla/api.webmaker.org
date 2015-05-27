var userToken = {
  authorization: 'token userToken'
};

var userToken2 = {
  authorization: 'token userToken2'
};

var moderatorToken = {
  authorization: 'token moderatorToken'
};

var newFromToken = {
  authorization: 'token newFromToken'
};

var newFromToken2 = {
  authorization: 'token newFromToken2'
};

var moderatorNotFound = {
  authorization: 'token moderatorNotFound'
};

exports.pgAdapter = {
  fail: {
    url: '/discover',
    method: 'get'
  },
  postFail: {
    url: '/users/1/projects',
    method: 'post',
    payload: {
      title: 'create_test'
    },
    headers: userToken
  }
};

exports.prerequisites = {
  fail: {
    url: '/users/1/projects/1',
    method: 'patch',
    payload: {
      title: 'new'
    },
    headers: userToken
  }
};

exports.get = {
  discover: {
    success: {
      default: {
        url: '/discover',
        method: 'get'
      },
      changeCount: {
        url: '/discover?count=3',
        method: 'get'
      },
      changePage: {
        url: '/discover?count=3&page=2',
        method: 'get'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/discover?count=50&page=2',
        method: 'get'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/discover?count=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/discover?count=101',
            method: 'get'
          },
          notNumber: {
            url: '/discover?count=foo'
          }
        },
        page: {
          negative: {
            url: '/discover?page=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/discover?page=51',
            method: 'get'
          },
          notNumber: {
            url: '/discover?page=foo'
          }
        }
      },
      error: {
        url: '/discover',
        method: 'get'
      }
    }
  },
  one: {
    success: {
      url: '/users/1/projects/1',
      method: 'get'
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/90/projects/1',
            method: 'get'
          },
          notNumber: {
            url: '/users/foo/projects/1',
            method: 'get'
          }
        },
        projects: {
          notFound: {
            url: '/users/1/projects/4',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/foo',
            method: 'get'
          }
        }
      },
      error: {
        url: '/users/1/projects/1',
        method: 'get'
      }
    }
  },
  all: {
    success: {
      default: {
        url: '/projects',
        method: 'get'
      },
      changeCount: {
        url: '/projects?count=3',
        method: 'get'
      },
      changePage: {
        url: '/projects?count=3&page=2',
        method: 'get'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/projects?count=50&page=2',
        method: 'get'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/projects?count=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/projects?count=101',
            method: 'get'
          },
          notNumber: {
            url: '/projects?count=foo'
          }
        },
        page: {
          negative: {
            url: '/projects?page=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/projects?page=51',
            method: 'get'
          },
          notNumber: {
            url: '/projects?page=foo'
          }
        }
      },
      error: {
        url: '/projects',
        method: 'get'
      }
    }
  },
  byUser: {
    success: {
      default: {
        url: '/users/1/projects',
        method: 'get'
      },
      changeCount: {
        url: '/users/1/projects?count=3',
        method: 'get'
      },
      changePage: {
        url: '/users/1/projects?count=2&page=2',
        method: 'get'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/users/1/projects?count=50&page=2',
        method: 'get'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/users/1/projects?count=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/users/1/projects?count=101',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects?count=foo'
          }
        },
        page: {
          negative: {
            url: '/users/1/projects?page=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/users/1/projects?page=51',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects?page=foo'
          }
        }
      },
      params: {
        user: {
          notFound: {
            url: '/users/90/projects',
            method: 'get'
          },
          notNumber: {
            url: '/users/foo/projects',
            method: 'get'
          }
        }
      },
      error: {
        url: '/users/1/projects',
        method: 'get'
      }
    }
  },
  remixes: {
    success: {
      default: {
        url: '/users/1/projects/1/remixes',
        method: 'get'
      },
      changeCount: {
        url: '/users/1/projects/1/remixes?count=3',
        method: 'get'
      },
      changePage: {
        url: '/users/1/projects/1/remixes?count=2&page=2',
        method: 'get'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/users/1/projects/1/remixes?count=50&page=2',
        method: 'get'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/users/1/projects/1/remixes?count=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/users/1/projects/1/remixes?count=101',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/1/remixes?count=foo'
          }
        },
        page: {
          negative: {
            url: '/users/1/projects/1/remixes?page=-1',
            method: 'get'
          },
          tooHigh: {
            url: '/users/1/projects/1/remixes?page=900',
            method: 'get'
          },
          notNumber: {
            url: '/users/1/projects/1/remixes?page=foo'
          }
        }
      },
      params: {
        user: {
          notFound: {
            url: '/users/90/projects/1/remixes',
            method: 'get'
          },
          notNumber: {
            url: '/users/foo/projects/1/remixes',
            method: 'get'
          }
        }
      },
      error: {
        url: '/users/1/projects/1/remixes',
        method: 'get'
      }
    }
  }
};

exports.create = {
  new: {
    success: {
      withoutThumbnail: {
        url: '/users/1/projects',
        method: 'post',
        payload: {
          title: 'create_test'
        },
        headers: userToken
      },
      withThumbnail: {
        url: '/users/1/projects',
        method: 'post',
        payload: {
          title: 'create_test2',
          thumbnail: {
            400: 'https://example.com/image.png'
          }
        },
        headers: userToken
      },
      userFromToken: {
        url: '/users/45/projects',
        method: 'post',
        payload: {
          title: 'new_from_token'
        },
        headers: newFromToken
      }
    },
    fail: {
      payload: {
        title: {
          url: '/users/1/projects',
          method: 'post',
          payload: {
            title: 123,
            thumbnail: {
              400: 'https://example.com/image.png'
            }
          },
          headers: userToken
        },
        thumb: {
          url: '/users/1/projects',
          method: 'post',
          payload: {
            title: 'bad_thumb',
            thumbnail: 'https://example.com/image.png'
          },
          headers: userToken
        },
        thumbValue: {
          url: '/users/1/projects',
          method: 'post',
          payload: {
            title: 'bad_thumb',
            thumbnail: {
              400: 123
            }
          },
          headers: userToken
        },
        thumbKey: {
          url: '/users/1/projects',
          method: 'post',
          payload: {
            title: 'bad_thumb',
            thumbnail: {
              2048: 'https://example.com/image.png'
            }
          },
          headers: userToken
        }
      },
      params: {
        user: {
          notNumber : {
            url: '/users/foo/projects',
            method: 'post',
            payload: {
              title: 'bad_param',
              thumbnail: {
                400: 'https://example.com/image.png'
              }
            },
            headers: userToken
          },
          notFound : {
            url: '/users/56/projects',
            method: 'post',
            payload: {
              title: 'bad_param',
              thumbnail: {
                400: 'https://example.com/image.png'
              }
            },
            headers: userToken
          }
        }
      },
      auth: {
        wrongUser: {
          url: '/users/1/projects',
          method: 'post',
          payload: {
            title: 'bad_param',
            thumbnail: {
              400: 'https://example.com/image.png'
            }
          },
          headers: userToken2
        },
        userFromToken: {
          url: '/users/46/projects',
          method: 'post',
          payload: {
            title: 'new_from_token'
          },
          headers: newFromToken2
        },
        tokenUserError: {
          url: '/users/1/projects',
          method: 'post',
          payload: {
            title: 'new_from_token'
          },
          headers: moderatorNotFound
        }
      },
      error: {
        url: '/users/1/projects',
        method: 'post',
        payload: {
          title: 'error_test'
        },
        headers: userToken
      }
    }
  },
  remix: {
    success: {
      remix:{
        url: '/users/1/projects/2/remixes',
        method: 'post',
        headers: userToken
      },
      checkRemix: {
        url: '/users/1/projects/$1',
        method: 'get'
      }
    },
    fail: {
      params: {
        user: {
          notNumber: {
            url: '/users/foo/projects/2/remixes',
            method: 'post',
            headers: userToken
          },
          notFound: {
            url: '/users/467/projects/2/remixes',
            method: 'post',
            headers: userToken
          }
        },
        project: {
          notNumber: {
            url: '/users/1/projects/foo/remixes',
            method: 'post',
            headers: userToken
          },
          notFound: {
            url: '/users/1/projects/2334/remixes',
            method: 'post',
            headers: userToken
          }
        }
      },
      error: {
        url: '/users/1/projects/2/remixes',
        method: 'post',
        headers: userToken
      }
    }
  }
};

exports.patch = {
  update: {
    success: {
      title: {
        url: '/users/1/projects/1',
        method: 'patch',
        payload: {
          title: 'new'
        },
        headers: userToken
      },
      thumb: {
        url: '/users/1/projects/1',
        method: 'patch',
        payload: {
          thumbnail: {
            '400': 'new'
          }
        },
        headers: userToken
      },
      thumb2: {
        url: '/users/1/projects/1',
        method: 'patch',
        payload: {
          thumbnail: {
            '1024': 'new'
          }
        },
        headers: userToken
      },
      clearThumb: {
        url: '/users/1/projects/1',
        method: 'patch',
        payload: {
          thumbnail: {}
        },
        headers: userToken
      },
      all: {
        url: '/users/1/projects/1',
        method: 'patch',
        payload: {
          title: 'new2',
          thumbnail: {
            '400': 'new2'
          }
        },
        headers: userToken
      }
    },
    fail: {
      param: {
        user: {
          url: '/users/cade/projects/1',
          method: 'patch',
          payload: {
            title: 'new2'
          },
          headers: userToken
        },
        project: {
          url: '/users/1/projects/wat',
          method: 'patch',
          payload: {
            title: 'new2'
          },
          headers: userToken
        }
      },
      payload: {
        title: {
          url: '/users/1/projects/1',
          method: 'patch',
          payload: {
            title: 123
          },
          headers: userToken
        },
        thumb: {
          url: '/users/1/projects/1',
          method: 'patch',
          payload: {
            thumbnail: 123
          },
          headers: userToken
        },
        thumbValue: {
          url: '/users/1/projects/1',
          method: 'patch',
          payload: {
            thumbnail: {
              400: 123
            }
          },
          headers: userToken
        },
        thumbKey: {
          url: '/users/1/projects/1',
          method: 'patch',
          payload: {
            thumbnail: {
              2048: 'new'
            }
          },
          headers: userToken
        }
      },
      auth: {
        wrongUser: {
          url: '/users/1/projects/1',
          method: 'patch',
          payload: {
            thumbnail: {
              400: 'new'
            }
          },
          headers: userToken2
        }
      },
      error:  {
        url: '/users/1/projects/1',
        method: 'patch',
        payload: {
          title: 'new'
        },
        headers: userToken
      }
    }
  },
  feature: {
    success: {
      feature: {
        url: '/users/1/projects/1/feature',
        method: 'patch',
        headers: moderatorToken
      },
      unfeature: {
        url: '/users/1/projects/2/feature',
        method: 'patch',
        headers: moderatorToken
      }
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/90/projects/1/feature',
            method: 'patch',
            headers: moderatorToken
          },
          notNumber: {
            url: '/users/foo/projects/1/feature',
            method: 'patch',
            headers: moderatorToken
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/90/feature',
            method: 'patch',
            headers: moderatorToken
          },
          notNumber: {
            url: '/users/1/projects/foo/feature',
            method: 'patch',
            headers: moderatorToken
          }
        }
      },
      auth: {
        notMod: {
          url: '/users/1/projects/1/feature',
          method: 'patch',
          headers: userToken
        }
      },
      error: {
        url: '/users/1/projects/1/feature',
        method: 'patch',
        headers: moderatorToken
      }
    }
  }
};

exports.del = {
  success: {
    owner:{
      url: '/users/1/projects/1',
      method: 'delete',
      headers: userToken
    },
    moderator: {
      url: '/users/1/projects/2',
      method: 'delete',
      headers: moderatorToken
    }
  },
  fail: {
    params: {
      user: {
        notNumber: {
          url: '/users/foo/projects/2',
          method: 'delete',
          headers: userToken
        },
        notFound: {
          url: '/users/458/projects/2',
          method: 'delete',
          headers: userToken
        }
      },
      project: {
        notNumber: {
          url: '/users/1/projects/foo',
          method: 'delete',
          headers: userToken
        },
        notFound: {
          url: '/users/1/projects/1',
          method: 'delete',
          headers: userToken
        }
      }
    },
    auth: {
      notOwner: {
        url: '/users/3/projects/5',
        method: 'delete',
        headers: userToken2
      }
    },
    error: {
      url: '/users/2/projects/3',
      method: 'delete',
      headers: userToken2
    }
  }
};

exports.options = {
  success: {
    url: '/discover',
    method: 'options'
  }
};
