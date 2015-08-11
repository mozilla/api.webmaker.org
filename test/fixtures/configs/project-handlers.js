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

exports.pgAdapter = {
  fail: {
    url: '/discover',
    method: 'get'
  },
  createFail: {
    url: '/users/1/projects',
    method: 'post',
    payload: {
      title: 'create_test'
    },
    headers: userToken
  },
  remixFail: {
    url: '/users/1/projects/1/remixes',
    method: 'post',
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
  findOneShallow: {
    success: {
      default: {
        url: '/projects/1',
        method: 'get'
      }
    },
    fail : {
      doesNotExist: {
        url: '/projects/999999999',
        method: 'get'
      },
      badIdType: {
        url: '/projects/a',
        method: 'get'
      },
      internalError: {
        url: '/projects/1',
        method: 'get'
      }
    }
  },
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
  discoverByLanguage: {
    success: {
      default: {
        url: '/discover/en-US',
        method: 'get'
      },
      changeLanguageENGB: {
        url: '/discover/en-GB',
        method: 'get'
      },
      changeLanguageBNBD: {
        url: '/discover/bn-BD',
        method: 'get'
      },
      changeLanguageIDID: {
        url: '/discover/id-ID',
        method: 'get'
      },
      changeLanguageLolRofl: {
        url: '/discover/lol-rofl',
        method: 'get'
      },
      changeCount: {
        url: '/discover/en-US?count=3',
        method: 'get'
      },
      changePage: {
        url: '/discover/en-US?count=3&page=2',
        method: 'get'
      },
      returnsNoneWhenPageTooHigh: {
        url: '/discover/en-US?count=50&page=2',
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
      params: {
        language: {
          changeLanguageNonsense: {
            url: '/discover/-.@',
            method: 'get'
          },
          changeLanguageNewline: {
            url: '/discover/-.@',
            method: 'get'
          },
          changeLanguageNumber: {
            url: '/discover/2',
            method: 'get'
          }
        }
      },
      error: {
        url: '/discover/en-US',
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
            320: 'https://example.com/image.png'
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
              320: 'https://example.com/image.png'
            }
          },
          headers: userToken
        },
        titleLength: {
          url: '/users/1/projects',
          method: 'post',
          payload: {
            title: 'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title',
            thumbnail: {
              320: 'https://example.com/image.png'
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
              320: 123
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
                320: 'https://example.com/image.png'
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
                320: 'https://example.com/image.png'
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
              320: 'https://example.com/image.png'
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
        url: '/users/1/projects/1/remixes',
        method: 'post',
        headers: userToken2
      },
      checkRemixProject: {
        url: '/users/2/projects/$1',
        method: 'get'
      },
      checkRemixPages: {
        url: '/users/2/projects/$1/pages',
        method: 'get'
      },
      newUserFromRemix: {
        url: '/users/1/projects/1/remixes',
        method: 'post',
        headers: {
          authorization: 'token newFromRemix'
        }
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
      },
      findDataForRemix: {
        url: '/users/1/projects/1/remixes',
        method: 'post',
        headers: userToken
      },
      newUserFromRemix: {
        url: '/users/1/projects/1/remixes',
        method: 'post',
        headers: {
          authorization: 'token newFromRemix2'
        }
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
      withThumbnailKey: {
        url: '/users/1/projects/1',
        method: 'patch',
        payload: {
          title: 'newww',
          thumbnail: {
            '320': 'will not work'
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
              320: 123
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
        },
        titleLength: {
          url: '/users/1/projects/1',
          method: 'patch',
          payload: {
            title: 'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title' +
                   'This is a really long title',
            thumbnail: {
              320: 'https://example.com/image.png'
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
            title: 'bad form, peter'
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

exports.delShallow = {
  success: {
    moderator: {
      url: '/projects/4',
      method: 'delete',
      headers: moderatorToken
    }
  },
  fail: {
    params: {
      project: {
        notFound: {
          url: '/projects/999999999',
          method: 'delete',
          headers: moderatorToken
        },
        notNumber: {
          url: '/projects/a',
          method: 'delete',
          headers: moderatorToken
        }
      }
    },
    auth: {
      notModerator: {
        url: '/projects/9',
        method: 'delete',
        headers: userToken
      }
    }
  }
}

exports.del = {
  success: {
    owner:{
      url: '/users/1/projects/7',
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
          url: '/users/1/projects/7',
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

exports.tail = {
  success: {
    update: {
      url: '/users/1/projects/1/pages/3',
      method: 'patch',
      headers: userToken,
      payload: {
        x: 0
      }
    },
    check: {
      url: '/users/1/projects/1',
      method: 'get'
    }
  },
  noOverwrite: {
    update: {
      url: '/users/1/projects/1/pages/3',
      method: 'patch',
      headers: userToken,
      payload: {
        x: 5
      }
    },
    updateTitle: {
      url: '/users/1/projects/1',
      method: 'patch',
      payload: {
        title: 'foo'
      },
      headers: userToken
    },
    check: {
      url: '/users/1/projects/1',
      method: 'get'
    }
  },
  elementSuccess: {
    update: {
      url: '/users/1/projects/1/pages/3/elements/25',
      method: 'patch',
      headers: userToken,
      payload: {
        attributes: {
          text: 'foo'
        }
      }
    },
    check: {
      url: '/users/1/projects/1',
      method: 'get'
    }
  },
  noUpdate: {
    update: {
      url: '/users/1/projects/1/pages/4',
      method: 'patch',
      headers: userToken,
      payload: {
        x: 3
      }
    },
    check: {
      url: '/users/1/projects/1',
      method: 'get'
    }
  },
  elementNoUpdate: {
    update: {
      url: '/users/1/projects/1/pages/4/elements/27',
      method: 'patch',
      headers: userToken,
      payload: {
        attributes: {
          text: 'foo'
        }
      }
    },
    check: {
      url: '/users/1/projects/1',
      method: 'get'
    }
  },
  fail: {
    url: '/users/1/projects/1/pages/3',
    method: 'patch',
    headers: userToken,
    payload: {
      x: 4
    }
  }
};
