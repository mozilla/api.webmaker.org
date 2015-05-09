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
  Joi.number(),
  Joi.string().regex(/^\d+$/)
);

var routes = [
  {
    path: '/users/{user}',
    method: 'get',
    handler: users.get,
    config: {
      auth: {
        scope: 'user'
      },
      validate: {
        params: {
          user: Joi.number().required()
        }
      },
      cors: {
        methods: ['options', 'get', 'patch', 'delete']
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
          user: Joi.number().required()
        },
        payload: {
          username: Joi.string().max(20).optional(),
          language: Joi.string().length(2).optional(),
          country: Joi.string().length(2).optional()
        }
      },
      cors: {
        methods: ['options', 'get', 'patch', 'delete']
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
        methods: ['options', 'get', 'patch', 'delete']
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
        methods: ['options', 'get', 'patch', 'delete']
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
          remixed_from: Joi.number().optional(),
          thumbnail: Joi.object().keys({
            400: Joi.string().optional(),
            1024: Joi.string().optional()
          }).default({})
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.canCreate
      ],
      cors: {
        methods: ['options', 'post', 'get']
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
        prerequisites.getProject,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['options', 'get', 'patch', 'delete']
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
        prerequisites.getProject,
        prerequisites.canDelete
      ],
      cors: {
        methods: ['options', 'get', 'patch', 'delete']
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
        prerequisites.getProject
      ],
      cors: {
        methods: ['options', 'get', 'post']
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
        prerequisites.getProject,
        prerequisites.isMod
      ],
      cors: {
        methods: ['options', 'post']
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
        methods: ['options', 'post']
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
          x: Joi.number().required(),
          y: Joi.number().required(),
          styles: Joi.object().default({})
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getProject,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['get', 'post', 'options']
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
          x: Joi.number(),
          y: Joi.number(),
          styles: Joi.object()
        }).or('x', 'y', 'styles')
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getProject,
        prerequisites.getPage,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['get', 'patch', 'delete', 'options']
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
        prerequisites.getProject,
        prerequisites.getPage,
        prerequisites.canWrite
      ],
      cors: {
        methods: ['get', 'patch', 'delete', 'options']
      }
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, route, authRouteConfig);
});

module.exports = routes;
