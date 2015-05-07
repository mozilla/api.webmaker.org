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
          user: Joi.number().required()
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
        methods: ['get', 'options']
      }
    }
  }, {
    path: '/users/{user}/projects/{project}',
    method: 'get',
    handler: projects.get.one,
    config: {
      validate: {
        params: {
          user: Joi.number().required(),
          project: Joi.number().required()
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
          user: Joi.number().required(),
          project: Joi.number().required()
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
          user: Joi.number().required()
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
          user: Joi.number().required(),
          project: Joi.number().required()
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
          user: Joi.number().required(),
          project: Joi.number().required()
        },
        query: {
          count: Joi.number().min(1).max(100).default(10),
          page: Joi.number().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.calculateOffset
      ],
      cors: {
        methods: ['get', 'post', 'options']
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
