var Joi = require('joi');
var _ = require('lodash');

var publicRouteConfig = {
  config: {
    auth: false,
    plugins: {
      versions: {
        '1.0.0': true
      }
    }
  }
};

var locale = require('../lib/locale');
var prerequisites = require('../lib/prerequisites');
var projects = require('../handlers/projects');
var pages = require('../handlers/pages');
var elements = require('../handlers/elements');
var bulk = require('../handlers/bulk');

var numericSchema = Joi.alternatives().try(
  Joi.number().integer().positive(),
  Joi.string().regex(/^\d+$/)
);

var routes = [
  {
    path: '/projects',
    method: 'get',
    handler: projects.get.all,
    config: {
      validate: {
        query: {
          count: Joi.number().integer().min(1).max(100).default(10),
          page:Joi.number().integer().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.calculateOffset
      ],
      cors: true
    }
  }, {
    path: '/featured-tags',
    method: 'get',
    handler: projects.get.featuredTags,
    config: {
      cors: true
    }
  }, {
    path: '/projects/tagged/{tag}',
    method: 'get',
    handler: projects.get.withTag,
    config: {
      validate: {
        query: {
          count: Joi.number().integer().min(1).max(100).default(10),
          page:Joi.number().integer().min(1).max(50).default(1)
        },
        params: {
          tag: Joi.string().max(140)
        }
      },
      pre: [
        prerequisites.calculateOffset
      ],
      cors: true
    }
  }, {
    path: '/projects/{project}',
    method: 'get',
    handler: projects.get.oneShallow,
    config: {
      validate: {
        params: {
          project: numericSchema
        }
      },
      cors: true
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
          count: Joi.number().integer().min(1).max(100).default(10),
          page:Joi.number().integer().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.calculateOffset
      ],
      cors: true
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
      cors: true
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
      cors: true
    }
  }, {
    path: '/featured-tags',
    method: 'options',
    handler: projects.options,
    config: {
      cors: true
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
          count: Joi.number().integer().min(1).max(100).default(10),
          page: Joi.number().integer().min(1).default(1)
        }
      },
      cors: true
    }
  }, {
    path: '/users/{user}/bulk',
    method: 'options',
    handler: bulk.options,
    config: {
      validate: {
        params: {
          user: numericSchema
        }
      },
      cors: true
    }
  }, {
    path: '/projects',
    method: 'options',
    handler: projects.options,
    config: {
      validate: {
        query: {
          count: Joi.number().integer().min(1).max(100),
          page:Joi.number().integer().min(1)
        }
      },
      cors: true
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
          count: Joi.number().integer().min(1).max(100).default(10),
          page:Joi.number().integer().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.getUser,
        prerequisites.getProject,
        prerequisites.calculateOffset
      ],
      cors: true
    }
  }, {
    path: '/discover',
    method: 'get',
    handler: projects.get.featured,
    config: {
      validate: {
        query: {
          count: Joi.number().integer().min(1).max(100).default(10),
          page: Joi.number().integer().min(1).max(50).default(1)
        }
      },
      pre: [
        prerequisites.calculateOffset
      ],
      cors: true
    }
  }, {
    path: '/discover',
    method: 'options',
    handler: projects.options,
    config: {
      cors: true
    }
  }, {
    path: '/discover/{language}',
    method: 'get',
    handler: projects.get.featuredByLanguage,
    config: {
      validate: {
        query: {
          count: Joi.number().integer().min(1).max(100).default(10),
          page: Joi.number().integer().min(1).max(50).default(1)
        },
        params: {
          // Wrote this regex to accept every language string on transifex.com/languages
          language: Joi.string().min(2).max(20).regex(locale.languageRegex)
        }
      },
      pre: [
        prerequisites.calculateOffset
      ],
      cors: true
    }
  }, {
    path: '/discover/{locale}',
    method: 'options',
    handler: projects.options,
    config: {
      cors: true
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
      cors: true
    }
  }, {
    path: '/view-project/{project}',
    method: 'options',
    handler: projects.options,
    config: {
      validate: {
        params: {
          project: numericSchema
        }
      },
      cors: true
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
      cors: true
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
      cors: true
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
      cors: true
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
      cors: true
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
      cors: true
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
      cors: true
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
      cors: true
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
      cors: true
    }
  }
];

routes = routes.map(function(route) {
  return _.merge({}, publicRouteConfig, route);
});

module.exports = routes;
