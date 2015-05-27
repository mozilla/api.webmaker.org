var Joi = require('joi');
var _ = require('lodash');

var authRouteConfig = {
  config: {
    auth: {
      mode: 'required',
      strategies: ['token']
    }
  }
};

var prerequisites = require('../lib/prerequisites');
var users = require('../handlers/users');
var projects = require('../handlers/projects');
var pages = require('../handlers/pages');
var elements = require('../handlers/elements');

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
          language: Joi.string().length(2).optional(),
          country: Joi.string().length(2).optional()
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
          title: Joi.string().required(),
          remixed_from: Joi.number().integer().optional(),
          thumbnail: Joi.object().keys({
            400: Joi.string().optional(),
            1024: Joi.string().optional()
          }).default({})
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.canCreate
      ],
      cors: {
        methods: ['OPTIONS', 'POST', 'GET']
      },
      plugins: {
        'hapi-limiter': {
          enable: true,
          limit: 5,
          ttl: 1000 * 30,
          generateKeyFunc: function(request) {
            return request.method + ':' + request.path + ':' + request.auth.credentials.id;
          }
        }
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
          title: Joi.string().optional(),
          thumbnail: Joi.object().keys({
            400: Joi.string().optional(),
            1024: Joi.string().optional()
          }).default({})
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getTokenUser,
        prerequisites.getProject,
        prerequisites.canWrite
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
        prerequisites.getProject
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
  }
];

routes = routes.map(function(route) {
  return _.merge({}, route, authRouteConfig);
});

module.exports = routes;
