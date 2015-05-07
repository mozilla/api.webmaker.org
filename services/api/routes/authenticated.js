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
          user: Joi.number().required()
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
          user: Joi.number().required()
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
        methods: ['options', 'post']
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
          user: Joi.number().required(),
          project: Joi.number().required()
        },
        payload: {
          title: Joi.string().optional(),
          thumbnail: Joi.object().keys({
            400: Joi.string().optional(),
            1024: Joi.string().optional()
          }).optional({})
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getProject,
        prerequisites.canUpdate
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
          user: Joi.number().required(),
          project: Joi.number().required()
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
          user: Joi.number().required(),
          project: Joi.number().required()
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
          user: Joi.number().required(),
          project: Joi.number().required()
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getProject,
        prerequisites.isMod
      ],
      cors: {
        methods: ['options', 'get', 'post']
      }
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, route, authRouteConfig);
});

module.exports = routes;
