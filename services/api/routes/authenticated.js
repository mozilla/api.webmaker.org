var Joi = require('joi');
var _ = require('lodash');

var authRouteConfig = {
  config: {
    auth: {
      mode: 'required',
      strategies: ['token']
    },
    plugins: {
      versions: {
        '1.0.0': true
      }
    }
  }
};

var locale = require('../lib/locale');
var prerequisites = require('../lib/prerequisites');
var users = require('../handlers/users');
var projects = require('../handlers/projects');
var pages = require('../handlers/pages');
var elements = require('../handlers/elements');
var bulk = require('../handlers/bulk');

var numericSchema = Joi.alternatives().try(
  Joi.number().integer(),
  Joi.string().regex(/^\d+$/)
);

var routes = [
  {
    path: '/users',
    method: 'post',
    handler: users.post,
    config: {
      auth: {
        scope: 'user'
      },
      cors: {
        methods: ['POST', 'OPTIONS']
      },
      description: 'Create a user account'
    }
  }, {
    path: '/users',
    method: 'options',
    handler: users.options,
    config: {
      auth: {
        scope: 'user'
      },
      cors: {
        methods: ['POST', 'OPTIONS']
      },
      plugins: {
        lout: false
      }
    }
  }, {
    path: '/users/{user}',
    method: 'get',
    handler: users.get,
    config: {
      auth: {
        scope: 'user'
      },
      validate: {
        params: {
          user: numericSchema
        }
      },
      cors: {
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE']
      }
    }
  }, {
    path: '/users/{user}',
    method: 'patch',
    handler: users.patch,
    config: {
      auth: {
        scope: 'user'
      },
      validate: {
        params: {
          user: numericSchema
        },
        payload: {
          username: Joi.string().max(20).optional(),
          // Wrote this regex to accept every language string on transifex.com/languages
          language: Joi.string().min(2).max(20).regex(locale.languageRegex)
        }
      },
      cors: {
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE']
      }
    }
  }, {
    path: '/users/{user}',
    method: 'delete',
    handler: users.del,
    config: {
      auth: {
        scope: 'user'
      },
      validate: {
        params: {
          user: numericSchema
        }
      },
      cors: {
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE']
      }
    }
  }, {
    path: '/users/{user}',
    method: 'options',
    handler: users.options,
    config: {
      auth: {
        scope: 'user'
      },
      cors: {
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE']
      },
      plugins: {
        lout: false
      }
    }
  }, {
    path: '/users/{user}/projects',
    method: 'post',
    handler: projects.post.create,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema
        },
        payload: {
          title: Joi.string().max(256).required(),
          remixed_from: Joi.number().integer().optional(),
          thumbnail: Joi.object().keys({
            320: Joi.string().optional()
          }).default({}),
          description: Joi.string().max(140).default('')
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.canCreate,
        prerequisites.setDescription,
        prerequisites.extractTags
      ],
      cors: {
        methods: ['OPTIONS', 'POST', 'GET']
      }
    }
  }, {
    path: '/users/{user}/bulk',
    method: 'post',
    handler: bulk.post,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema
        },
        payload: {
          actions: Joi.array().required().items(
            Joi.alternatives().try([
              Joi.object().keys({
                type: Joi.string().valid('projects').required(),
                method: Joi.string().valid('create').required(),
                data: Joi.object().keys({
                  title: Joi.string().max(256).required(),
                  thumbnail: Joi.object().keys({
                    320: Joi.string().optional()
                  }).default({}),
                  description: Joi.string(100).default('')
                })
              }),
              Joi.object().keys({
                type: Joi.string().valid('projects').required(),
                method: Joi.string().valid('update').required(),
                data: Joi.object().keys({
                  id: Joi.alternatives().try(
                    Joi.number().integer().required(),
                    Joi.string().regex(/^\$(\d+)\.(.*)$/)
                  ),
                  title: Joi.string().max(256).required(),
                  description: Joi.string().max(100).default('')
                })
              }),
              Joi.object().keys({
                type: Joi.string().valid('pages').required(),
                method: Joi.string().valid('create').required(),
                data: Joi.object().keys({
                  projectId: Joi.alternatives().try(
                    Joi.number().integer().required(),
                    Joi.string().regex(/^\$(\d+)\.(.*)$/)
                  ),
                  x: Joi.number().integer().required(),
                  y: Joi.number().integer().required(),
                  styles: Joi.object().default({}).optional()
                })
              }),
              Joi.object().keys({
                type: Joi.string().valid('pages').required(),
                method: Joi.string().valid('update').required(),
                data: Joi.object().keys({
                  id: Joi.alternatives().try(
                    Joi.number().integer().required(),
                    Joi.string().regex(/^\$(\d+)\.(.*)$/)
                  ),
                  x: Joi.number().integer().required(),
                  y: Joi.number().integer().required(),
                  styles: Joi.object().default({})
                })
              }),
              Joi.object().keys({
                type: Joi.string().valid('elements').required(),
                method: Joi.string().valid('create').required(),
                data: Joi.object().keys({
                  pageId: Joi.alternatives().try(
                    Joi.number().integer().required(),
                    Joi.string().regex(/^\$(\d+)\.(.*)$/)
                  ),
                  type: Joi.string().required(),
                  styles: Joi.object().default({}),
                  attributes: Joi.object().default({})
                })
              }),
              Joi.object().keys({
                type: Joi.string().valid('elements').required(),
                method: Joi.string().valid('update').required(),
                data: Joi.object().keys({
                  id: Joi.alternatives().try(
                    Joi.number().integer().required(),
                    Joi.string().regex(/^\$(\d+)\.(.*)$/)
                  ),
                  styles: Joi.object().default({}),
                  attributes: Joi.object().default({})
                })
              }),
              Joi.object().keys({
                type: Joi.string().valid('projects', 'pages', 'elements').required(),
                method: Joi.string().valid('remove').required(),
                data: Joi.object().keys({
                  id: Joi.alternatives().try(
                    Joi.number().integer().required(),
                    Joi.string().regex(/^\$(\d+)\.(.*)$/)
                  )
                })
              })
            ])
          ).min(1).max(1000)
        }
      },
      pre: [
        prerequisites.getUser
      ],
      cors: {
        methods: ['POST', 'OPTIONS']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}',
    method: 'patch',
    handler: projects.patch.update,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        },
        payload: {
          title: Joi.string().max(250).optional(),
          thumbnail: Joi.object().optional(),
          description: Joi.string().max(140).allow('').optional()
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.canWrite,
        prerequisites.setTitle,
        prerequisites.setDescription,
        prerequisites.extractTags
      ],
      cors: {
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}',
    method: 'delete',
    handler: projects.del,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.canDelete
      ],
      cors: {
        methods: ['OPTIONS', 'GET', 'PATCH', 'DELETE']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/remixes',
    method: 'post',
    handler: projects.post.remix,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.prepareRemix
      ],
      cors: {
        methods: ['OPTIONS', 'GET', 'POST']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/feature',
    method: 'patch',
    handler: projects.patch.feature,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.isMod
      ],
      cors: {
        methods: ['OPTIONS', 'POST']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/feature',
    method: 'options',
    handler: projects.options,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      cors: {
        methods: ['OPTIONS', 'POST']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages',
    method: 'post',
    handler: pages.post.create,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        },
        payload: {
          x: Joi.number().integer().required(),
          y: Joi.number().integer().required(),
          styles: Joi.object().default({})
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['GET', 'POST', 'OPTIONS']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}',
    method: 'patch',
    handler: pages.patch.update,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema
        },
        payload: Joi.object().keys({
          x: Joi.number().integer(),
          y: Joi.number().integer(),
          styles: Joi.object()
        }).or('x', 'y', 'styles')
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.getPage,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS']
      }
    }
  },
  {
    path: '/users/{user}/projects/{project}/pages/{page}',
    method: 'delete',
    handler: pages.del,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.getPage,
        prerequisites.canDelete
      ],
      cors: {
        methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}/elements',
    method: 'post',
    handler: elements.post,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema
        },
        payload: {
          type: Joi.string().required(),
          attributes: Joi.object().default({}),
          styles: Joi.object().default({})
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.getPage,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['GET', 'POST', 'OPTIONS']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}/elements/{element}',
    method: 'patch',
    handler: elements.patch.update,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema,
          element: numericSchema
        },
        payload: Joi.object().keys({
          attributes: Joi.object(),
          styles: Joi.object()
        }).or('attributes', 'styles')
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.getPage,
        prerequisites.getElement,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}/elements/{element}',
    method: 'delete',
    handler: elements.del,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema,
          element: numericSchema
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.getPage,
        prerequisites.getElement,
        prerequisites.canDelete
      ],
      cors: {
        methods: ['GET', 'PATCH', 'DELETE', 'OPTIONS']
      }
    }
  }, {
    path: '/view-project/{project}',
    method: 'post',
    handler: projects.post.view,
    config: {
      auth: {
        scope: 'projects'
      },
      validate: {
        params: {
          project: numericSchema
        }
      },
      pre: [
        prerequisites.isValidView
      ],
      cors: {
        methods: ['POST', 'OPTIONS']
      }
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, route, authRouteConfig);
});

module.exports = routes;
