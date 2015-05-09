var Joi = require('joi');
var _ = require('lodash');

var publicRouteConfig = {
  config: {
    auth: false
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
    path: '/users',
    method: 'post',
    handler: users.post,
    config: {
      validate: {
        payload: {
          username: Joi.string().required(),
          language: Joi.string().length(2).optional(),
          country: Joi.string().length(2).optional()
        }
      },
      cors: {
        methods: ['post', 'options']
      },
      description: 'Create a user account'
    }
  }, {
    path: '/users',
    method: 'options',
    handler: users.options,
    config: {
      cors: {
        methods: ['post', 'options']
      },
      plugins: {
        lout: false
      }
    }
  }, {
    path: '/projects',
    method: 'get',
    handler: projects.get.all,
    config: {
      validate: {
        query: {
          count: Joi.number().min(1).max(100).default(10),
          page:Joi.number().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.calculateOffset
      ],
      cors: {
        methods: ['get', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects',
    method: 'get',
    handler: projects.get.allByUser,
    config: {
      validate: {
        params: {
          user: numericSchema
        },
        query: {
          count: Joi.number().min(1).max(100).default(10),
          page:Joi.number().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.calculateOffset
      ],
      cors: {
        methods: ['get', 'post', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}',
    method: 'get',
    handler: projects.get.one,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      pre: [
        prerequisites.getUser
      ],
      cors: {
        methods: ['get', 'patch', 'options', 'delete']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}',
    method: 'options',
    handler: projects.options,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      cors: {
        methods: ['get', 'patch', 'options', 'delete']
      }
    }
  }, {
    path: '/users/{user}/projects',
    method: 'options',
    handler: projects.options,
    config: {
      validate: {
        params: {
          user: numericSchema
        },
        query: {
          count: Joi.number().min(1).max(100).default(10),
          page:Joi.number().min(1).default(1)
        }
      },
      cors: {
        methods: ['get', 'options']
      }
    }
  }, {
    path: '/projects',
    method: 'options',
    handler: projects.options,
    config: {
      validate: {
        query: {
          count: Joi.number().min(1).max(100),
          page:Joi.number().min(1)
        }
      },
      cors: {
        methods: ['get', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/remixes',
    method: 'get',
    handler: projects.get.remixes,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        },
        query: {
          count: Joi.number().min(1).max(100).default(10),
          page:Joi.number().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getProject,
        prerequisites.calculateOffset
      ],
      cors: {
        methods: ['get', 'post', 'options']
      }
    }
  }, {
    path: '/discover',
    method: 'get',
    handler: projects.get.featured,
    config: {
      validate: {
        query: {
          count: Joi.number().min(1).max(100).default(10),
          page:Joi.number().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.calculateOffset
      ],
      cors: {
        methods: ['get', 'options']
      }
    }
  }, {
    path: '/discover',
    method: 'options',
    handler: projects.options,
    config: {
      cors: {
        methods: ['get', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/remixes',
    method: 'options',
    handler: projects.options,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      cors: {
        methods: ['get', 'post', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages',
    method: 'get',
    handler: pages.get.all,
    config: {
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
        methods: ['get', 'post', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages',
    method: 'options',
    handler: pages.options,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema
        }
      },
      cors: {
        methods: ['get', 'post', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}',
    method: 'get',
    handler: pages.get.one,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getProject
      ],
      cors: {
        methods: ['get', 'patch', 'delete', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}',
    method: 'options',
    handler: pages.options,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema
        }
      },
      cors: {
        methods: ['get', 'patch', 'delete', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}/elements',
    method: 'get',
    handler: elements.get.all,
    config: {
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
        prerequisites.getPage
      ],
      cors: {
        methods: ['get', 'post', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}/elements',
    method: 'options',
    handler: elements.options,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema
        }
      },
      cors: {
        methods: ['get', 'post', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}/elements/{element}',
    method: 'get',
    handler: elements.get.one,
    config: {
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
        prerequisites.getProject,
        prerequisites.getPage
      ],
      cors: {
        methods: ['get', 'patch', 'delete', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}/pages/{page}/elements/{element}',
    method: 'options',
    handler: elements.options,
    config: {
      validate: {
        params: {
          user: numericSchema,
          project: numericSchema,
          page: numericSchema,
          element: numericSchema
        }
      },
      cors: {
        methods: ['get', 'patch', 'delete', 'options']
      }
    }
  }, {
    path: '/docs/css/style.css',
    method: 'get',
    handler: {
      file: './node_modules/lout/public/css/style.css'
    },
    config: {
      plugins: {
        lout: false
      },
      cors: false
    }
  }, {
    path: '/',
    method: 'get',
    handler: function(request, reply) {
      reply.redirect('/docs');
    },
    config: {
      plugins: {
        lout: false
      },
      cors: false
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, publicRouteConfig, route);
});

module.exports = routes;
