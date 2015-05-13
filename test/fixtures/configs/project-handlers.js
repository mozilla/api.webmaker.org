var userToken = {
  authorization: 'token userToken'
};

var userToken2 = {
  authorization: 'token userToken2'
};

var moderatorToken = {
  authorization: 'token moderatorToken'
};

exports.pgAdapter = {
  fail: {
    url: '/discover',
    method: 'GET'
  }
};

exports.prerequisites = {
  fail: {
    url: '/users/1/projects/1',
    method: 'PATCH',
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
        method: 'GET'
      },
      changeCount: {
        url: '/discover?count=3',
        method: 'GET'
      },
      changePage: {
        url: '/discover?count=3&page=2',
        method: 'GET'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/discover?count=50&page=2',
        method: 'GET'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/discover?count=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/discover?count=101',
            method: 'GET'
          },
          notNumber: {
            url: '/discover?count=foo'
          }
        },
        page: {
          negative: {
            url: '/discover?page=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/discover?page=51',
            method: 'GET'
          },
          notNumber: {
            url: '/discover?page=foo'
          }
        }
      },
      error: {
        url: '/discover',
        method: 'GET'
      }
    }
  },
  one: {
    success: {
      url: '/users/1/projects/1',
      method: 'GET'
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/90/projects/1',
            method: 'GET'
          },
          notNumber: {
            url: '/users/foo/projects/1',
            method: 'GET'
          }
        },
        projects: {
          notFound: {
            url: '/users/1/projects/4',
            method: 'GET'
          },
          notNumber: {
            url: '/users/1/projects/foo',
            method: 'GET'
          }
        }
      },
      error: {
        url: '/users/1/projects/1',
        method: 'GET'
      }
    }
  },
  all: {
    success: {
      default: {
        url: '/projects',
        method: 'GET'
      },
      changeCount: {
        url: '/projects?count=3',
        method: 'GET'
      },
      changePage: {
        url: '/projects?count=3&page=2',
        method: 'GET'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/projects?count=50&page=2',
        method: 'GET'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/projects?count=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/projects?count=101',
            method: 'GET'
          },
          notNumber: {
            url: '/projects?count=foo'
          }
        },
        page: {
          negative: {
            url: '/projects?page=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/projects?page=51',
            method: 'GET'
          },
          notNumber: {
            url: '/projects?page=foo'
          }
        }
      },
      error: {
        url: '/projects',
        method: 'GET'
      }
    }
  },
  byUser: {
    success: {
      default: {
        url: '/users/1/projects',
        method: 'GET'
      },
      changeCount: {
        url: '/users/1/projects?count=3',
        method: 'GET'
      },
      changePage: {
        url: '/users/1/projects?count=2&page=2',
        method: 'GET'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/users/1/projects?count=50&page=2',
        method: 'GET'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/users/1/projects?count=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/users/1/projects?count=101',
            method: 'GET'
          },
          notNumber: {
            url: '/users/1/projects?count=foo'
          }
        },
        page: {
          negative: {
            url: '/users/1/projects?page=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/users/1/projects?page=51',
            method: 'GET'
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
            method: 'GET'
          },
          notNumber: {
            url: '/users/foo/projects',
            method: 'GET'
          }
        }
      },
      error: {
        url: '/users/1/projects',
        method: 'GET'
      }
    }
  },
  remixes: {
    success: {
      default: {
        url: '/users/1/projects/1/remixes',
        method: 'GET'
      },
      changeCount: {
        url: '/users/1/projects/1/remixes?count=3',
        method: 'GET'
      },
      changePage: {
        url: '/users/1/projects/1/remixes?count=2&page=2',
        method: 'GET'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/users/1/projects/1/remixes?count=50&page=2',
        method: 'GET'
      }
    },
    fail: {
      query: {
        count: {
          negative: {
            url: '/users/1/projects/1/remixes?count=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/users/1/projects/1/remixes?count=101',
            method: 'GET'
          },
          notNumber: {
            url: '/users/1/projects/1/remixes?count=foo'
          }
        },
        page: {
          negative: {
            url: '/users/1/projects/1/remixes?page=-1',
            method: 'GET'
          },
          tooHigh: {
            url: '/users/1/projects/1/remixes?page=900',
            method: 'GET'
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
            method: 'GET'
          },
          notNumber: {
            url: '/users/foo/projects/1/remixes',
            method: 'GET'
          }
        }
      },
      error: {
        url: '/users/1/projects/1/remixes',
        method: 'GET'
      }
    }
  }
};

exports.create = {
  new: {
    success: {
      withoutThumbnail: {
        url: '/users/1/projects',
        method: 'POST',
        payload: {
          title: 'create_test'
        },
        headers: userToken
      },
      withThumbnail: {
        url: '/users/1/projects',
        method: 'POST',
        payload: {
          title: 'create_test2',
          thumbnail: {
            400: 'https://example.com/image.png'
          }
        },
        headers: userToken
      }
    },
    fail: {
      payload: {
        title: {
          url: '/users/1/projects',
          method: 'POST',
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
          method: 'POST',
          payload: {
            title: 'bad_thumb',
            thumbnail: 'https://example.com/image.png'
          },
          headers: userToken
        },
        thumbValue: {
          url: '/users/1/projects',
          method: 'POST',
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
          method: 'POST',
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
            method: 'POST',
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
            method: 'POST',
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
          method: 'POST',
          payload: {
            title: 'bad_param',
            thumbnail: {
              400: 'https://example.com/image.png'
            }
          },
          headers: userToken2
        }
      },
      error: {
        url: '/users/1/projects',
        method: 'POST',
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
        method: 'POST',
        headers: userToken
      },
      checkRemix: {
        url: '/users/1/projects/$1',
        method: 'GET'
      }
    },
    fail: {
      params: {
        user: {
          notNumber: {
            url: '/users/foo/projects/2/remixes',
            method: 'POST',
            headers: userToken
          },
          notFound: {
            url: '/users/45/projects/2/remixes',
            method: 'POST',
            headers: userToken
          }
        },
        project: {
          notNumber: {
            url: '/users/1/projects/foo/remixes',
            method: 'POST',
            headers: userToken
          },
          notFound: {
            url: '/users/1/projects/2334/remixes',
            method: 'POST',
            headers: userToken
          }
        }
      },
      error: {
        url: '/users/1/projects/2/remixes',
        method: 'POST',
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
        method: 'PATCH',
        payload: {
          title: 'new'
        },
        headers: userToken
      },
      thumb: {
        url: '/users/1/projects/1',
        method: 'PATCH',
        payload: {
          thumbnail: {
            '400': 'new'
          }
        },
        headers: userToken
      },
      thumb2: {
        url: '/users/1/projects/1',
        method: 'PATCH',
        payload: {
          thumbnail: {
            '1024': 'new'
          }
        },
        headers: userToken
      },
      clearThumb: {
        url: '/users/1/projects/1',
        method: 'PATCH',
        payload: {
          thumbnail: {}
        },
        headers: userToken
      },
      all: {
        url: '/users/1/projects/1',
        method: 'PATCH',
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
          method: 'PATCH',
          payload: {
            title: 'new2'
          },
          headers: userToken
        },
        project: {
          url: '/users/1/projects/wat',
          method: 'PATCH',
          payload: {
            title: 'new2'
          },
          headers: userToken
        }
      },
      payload: {
        title: {
          url: '/users/1/projects/1',
          method: 'PATCH',
          payload: {
            title: 123
          },
          headers: userToken
        },
        thumb: {
          url: '/users/1/projects/1',
          method: 'PATCH',
          payload: {
            thumbnail: 123
          },
          headers: userToken
        },
        thumbValue: {
          url: '/users/1/projects/1',
          method: 'PATCH',
          payload: {
            thumbnail: {
              400: 123
            }
          },
          headers: userToken
        },
        thumbKey: {
          url: '/users/1/projects/1',
          method: 'PATCH',
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
          method: 'PATCH',
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
        method: 'PATCH',
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
        method: 'PATCH',
        headers: moderatorToken
      },
      unfeature: {
        url: '/users/1/projects/2/feature',
        method: 'PATCH',
        headers: moderatorToken
      }
    },
    fail: {
      params: {
        user: {
          notFound: {
            url: '/users/90/projects/1/feature',
            method: 'PATCH',
            headers: moderatorToken
          },
          notNumber: {
            url: '/users/foo/projects/1/feature',
            method: 'PATCH',
            headers: moderatorToken
          }
        },
        project: {
          notFound: {
            url: '/users/1/projects/90/feature',
            method: 'PATCH',
            headers: moderatorToken
          },
          notNumber: {
            url: '/users/1/projects/foo/feature',
            method: 'PATCH',
            headers: moderatorToken
          }
        }
      },
      auth: {
        notMod: {
          url: '/users/1/projects/1/feature',
          method: 'PATCH',
          headers: userToken
        }
      },
      error: {
        url: '/users/1/projects/1/feature',
        method: 'PATCH',
        headers: moderatorToken
      }
    }
  }
};

exports.del = {
  success: {
    owner:{
      url: '/users/1/projects/1',
      method: 'DELETE',
      headers: userToken
    },
    moderator: {
      url: '/users/1/projects/2',
      method: 'DELETE',
      headers: moderatorToken
    }
  },
  fail: {
    params: {
      user: {
        notNumber: {
          url: '/users/foo/projects/2',
          method: 'DELETE',
          headers: userToken
        },
        notFound: {
          url: '/users/45/projects/2',
          method: 'DELETE',
          headers: userToken
        }
      },
      project: {
        notNumber: {
          url: '/users/1/projects/foo',
          method: 'DELETE',
          headers: userToken
        },
        notFound: {
          url: '/users/1/projects/1',
          method: 'DELETE',
          headers: userToken
        }
      }
    },
    auth: {
      notOwner: {
        url: '/users/3/projects/5',
        method: 'DELETE',
        headers: userToken2
      }
    },
    error: {
      url: '/users/2/projects/3',
      method: 'DELETE',
      headers: userToken2
    }
  }
};

exports.options = {
  success: {
    url: '/discover',
    method: 'OPTIONS'
  }
};
