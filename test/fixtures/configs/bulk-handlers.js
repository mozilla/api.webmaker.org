var userToken = {
  authorization: 'token userToken'
};

module.exports = {
  success: {
    singleAction: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'bulk created'
            }
          }
        ]
      }
    },
    multiAction: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'bulk created'
            }
          },
          {
            type: 'pages',
            method: 'create',
            data: {
              projectId: '$0.id',
              x: 0,
              y: 1
            }
          },
          {
            type: 'elements',
            method: 'create',
            data: {
              pageId: '$1.id',
              type: 'text'
            }
          },
          {
            type: 'pages',
            method: 'update',
            data: {
              id: '$1.id',
              x: 1,
              y: 0
            }
          },
          {
            type: 'pages',
            method: 'create',
            data: {
              projectId: '$0.id',
              x: 0,
              y: 0
            }
          },
          {
            type: 'pages',
            method: 'update',
            data: {
              id: '$4.id',
              x: 2,
              y: 0
            }
          },
          {
            type: 'projects',
            method: 'update',
            data: {
              id: '$0.id',
              title: 'change project title'
            }
          },
          {
            type: 'elements',
            method: 'update',
            data: {
              id: '$2.id'
            }
          },
          {
            type: 'elements',
            method: 'remove',
            data: {
              id: '$2.id'
            }
          },
          {
            type: 'pages',
            method: 'remove',
            data: {
              id: '$1.id'
            }
          },
          {
            type: 'pages',
            method: 'remove',
            data: {
              id: '$4.id'
            }
          },
          {
            type: 'projects',
            method: 'remove',
            data: {
              id: '$0.id'
            }
          }
        ]
      }
    },
    updateExisting: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'update',
            data: {
              id: 1,
              title: 'test_project_1'
            }
          }
        ]
      }
    },
    thumbnailsStylesAttributes: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'title',
              thumbnail: {
                '320': 'https://example.com/img.png'
              }
            }
          },
          {
            type: 'pages',
            method: 'create',
            data: {
              projectId: '$0.id',
              x: 0,
              y: 0,
              styles: {}
            }
          },
          {
            type: 'elements',
            method: 'create',
            data: {
              pageId: '$1.id',
              type: 'text',
              styles: {},
              attributes: {}
            }
          },
          {
            type: 'pages',
            method: 'update',
            data: {
              id: '$1.id',
              x: 1,
              y: 0,
              styles: {}
            }
          },
          {
            type: 'elements',
            method: 'update',
            data: {
              id: '$2.id',
              styles: {},
              attributes: {}
            }
          }
        ]
      }
    }
  },
  failure: {
    pipelineIndexOutOfBounds: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'out of bounds project'
            }
          },
          {
            type: 'pages',
            method: 'create',
            data: {
              projectId: '$6.id',
              x: 0,
              y: 0
            }
          }
        ]
      }
    },
    invalidObjectReference: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'bad reference to the results of this action'
            }
          },
          {
            type: 'pages',
            method: 'create',
            data: {
              projectId: '$0.not.here',
              x: 0,
              y: 0
            }
          }
        ]
      }
    },
    insufficientPermissions: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'update',
            data: {
              id: 3,
              title: 'you can not update this'
            }
          }
        ]
      }
    },
    lookupNotFound: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'update',
            data: {
              id: 300,
              title: 'this project does not exist, therefore you can not update it'
            }
          }
        ]
      }
    },
    queryFailure: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'queryFailure'
            }
          },
          {
            type: 'pages',
            method: 'create',
            data: {
              projectId: '$0.id',
              x: 0,
              y: 0
            }
          },
          {
            type: 'pages',
            method: 'create',
            data: {
              projectId: '$0.id',
              x: 0,
              y: 0
            }
          }
        ]
      }
    },
    postgreNoTransaction: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'fails when creating a transaction client'
            }
          }
        ]
      }
    },
    rollbackFailure: {
      url: '/users/1/bulk',
      method: 'post',
      headers: userToken,
      payload: {
        actions: [
          {
            type: 'projects',
            method: 'create',
            data: {
              title: 'handles error if rollback fails'
            }
          }
        ]
      }
    }
  },
  options: {
    url: '/users/1/bulk',
    method: 'options',
    headers: userToken
  }
};
