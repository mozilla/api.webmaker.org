var Hoek = require('hoek');

exports.register = function(server, options, done) {
  var queryValuesMap =  {
    projects: {
      create: function(userId, data) {
        return [
          userId,
          null,
          server.methods.utils.version(),
          data.title,
          JSON.stringify(data.thumbnail)
        ];
      },
      update: function(userId, data) {
        return [
          data.title,
          data.id
        ];
      },
      remove: function(userId, data) {
        return [data.id];
      }
    },
    pages: {
      create: function(userId, data) {
        return [
          data.projectId,
          userId,
          data.x,
          data.y,
          JSON.stringify(data.styles)
        ];
      },
      update: function(userId, data) {
        return [
          data.x,
          data.y,
          JSON.stringify(data.styles),
          data.id
        ];
      },
      remove: function(userId, data) {
        return [data.id];
      }
    },
    elements: {
      create: function(userId, data) {
        return [
          data.pageId,
          userId,
          data.type,
          JSON.stringify(data.attributes),
          JSON.stringify(data.styles)
        ];
      },
      update: function(userId, data) {
        return [
          JSON.stringify(data.styles),
          JSON.stringify(data.attributes),
          data.id
        ];
      },
      remove: function(userId, data) {
        return [data.id];
      }
    }
  };

  function getQueryValues(type, method, userId, data) {
    return queryValuesMap[type][method](userId, data);
  }

  function getLookupData(userId, type, method, data) {
    // determine the type of query to run, and the id value to look up
    if ( method === 'create' ) {
      if ( type === 'pages' ) {
        // look up the project that this page should be created for, to ensure the current user owns it
        return {
          type: 'projects',
          id: '' + data.projectId
        };
      } else {
        return {
          type: 'pages',
          id: '' + data.pageId
        };
      }
    } else {
      // update / delete need to look up the target type by id to verify ownership
      return {
        type: type,
        id: '' + data.id
      };
    }
  }

  function getTxActionResult(lookups, results) {
    var type = lookups.type;
    var id = lookups.id;
    var len = results.length;

    // if the type being acted upon depends on a type created earlier in the transaction,
    // we won't be able to query for it, so lets find it now
    for (var i = 0; i < len; ++i) {
      var result = results[i].formatted;
      if ( result.method === 'create' && result.type === type && result.id === id ) {
        return result;
      }
    }
  }

  function getReplaceFunc(processResult, key, actionIndex, txResults) {
    // grab the index of the action results to reach into, and grab the value
    // described by reachString using Hoek.reach()
    return function replace(match, reachIdx, reachString) {
      reachIdx = +reachIdx;
      var value;

      if ( reachIdx < txResults.length ) {
        value = Hoek.reach(txResults[reachIdx].formatted, reachString);
      } else {
        processResult.invalid = true;
        processResult.errorReason = 'Array reference out of bounds for ' + key + ' in action at index ' + actionIndex;
        processResult.failureData = {
          key: key,
          reachIdx: reachIdx,
          actionIndex: actionIndex
        };
        return;
      }

      if ( !value ) {
        processResult.invalid = true;
        processResult.errorReason = 'Invalid reference to value using key \'' +
          key +
          '\' in action at index ' +
          actionIndex;
        processResult.failureData = {
          key: key,
          reachIdx: reachIdx,
          actionIndex: actionIndex
        };
        return;
      }

      return value;
    };
  }

  // matches string like '$0.id' where '$0' is the action result at the
  // 0th index and the value on that object keyed with 'id'
  var reachRegex = /^\$(\d+)\.(.*)$/;

  // check if a key on the action object should be resolved to a value
  // returned by a previous action in the transaction
  function generateEveryCallback(processResult, action, actionIndex, txResults) {
    return function everyCallback(key) {
      // if the key's value isn't a reach string, return valid
      if ( !reachRegex.test(action.data[key]) ) {
        return processResult;
      }

      action.data[key] = action.data[key].replace(
        reachRegex,
        getReplaceFunc(processResult, key, actionIndex, txResults)
      );
      return processResult;
    };
  }

  // Check if the key has been processed already,
  // we don't need to create another invalidation tail
  function shouldInvalidate(key, invalidations) {
    if (invalidations[key]) {
      return false;
    }

    invalidations[key] = true;
    return true;
  }

  function getKey() {
    return Array.prototype.join.call(arguments, '.');
  }

  function elementInvalidations(request, actionResult, invalidations) {
    var findAllKey = getKey('elements.findAll', actionResult.page_id);
    var findOneKey = getKey('elements.findOne', actionResult.id);
    var pagesFindOneKey = getKey('pages.findOne', actionResult.page_id);
    var pagesFindAllKey = getKey('pages.findAll', actionResult.project_id);

    if (shouldInvalidate(findOneKey, invalidations)) {
      request.server.methods.cache.invalidateKey(
        'elements',
        'findOne',
        [actionResult.id],
        request.tail('drop elements.findOne cache')
      );
    }

    if (shouldInvalidate(findAllKey, invalidations)) {
      request.server.methods.cache.invalidateKey(
        'elements',
        'findAll',
        [actionResult.page_id],
        request.tail('drop elements.findAll cache')
      );
    }

    if (shouldInvalidate(pagesFindOneKey, invalidations)) {
      request.server.methods.cache.invalidateKey(
        'pages',
        'findOne',
        [undefined, actionResult.page_id],
        request.tail('drop pages findOne cache')
      );
    }

    if (shouldInvalidate(pagesFindAllKey, invalidations)) {
      request.server.methods.cache.invalidateKey(
        'pages',
        'findAll',
        [actionResult.project_id],
        request.tail('drop pages findAll cache')
      );
    }
  }

  var invalidationMap = {
    projects: {
      create: function(request, actionResult, invalidations) {
        var key = getKey('projects.findUsersProjects', request.params.user);

        if (shouldInvalidate(key, invalidations)) {
          request.server.methods.cache.invalidateKeys(
            'projects',
            'findUsersProjects',
            request.params.user,
            request.tail('drop projects.findUsersProjects cache')
          );
        }
      },
      update: function(request, actionResult, invalidations) {
        var findOneKey = getKey('projects.findOne', actionResult.id, request.params.user);
        var findUsersProjectsKey = getKey('projects.findUsersProjects', request.params.user);

        if (shouldInvalidate(findOneKey, invalidations)) {
          request.server.methods.cache.invalidateKey(
            'projects',
            'findOne',
            [actionResult.id, request.params.user],
            request.tail('drop projects.findOne cache')
          );
        }

        if (!shouldInvalidate(findUsersProjectsKey, invalidations)) {
          request.server.methods.cache.invalidateKeys(
            'projects',
            'findUsersProjects',
            request.params.user,
            request.tail('drop projects.findUsersProjects cache')
          );
        }
      },
      remove: function(request, actionResult, invalidations) {
        request.server.methods.cache.invalidateKeys(
          'projects',
          'findFeatured',
          request.tail('drop projects.findFeatured cache')
        );
      }
    },
    pages: {
      create: function(request, actionResult, invalidations) {
        var findAllKey = getKey('pages.findAll', actionResult.project_id);

        if (shouldInvalidate(findAllKey, invalidations)) {
          invalidations[findAllKey] = true;
          request.server.methods.cache.invalidateKey(
            'pages',
            'findAll',
            [actionResult.project_id],
            request.tail('drop pages.findAll cache')
          );
        }
      },
      update: function(request, actionResult, invalidations) {
        var findAllKey = getKey('pages.findAll', actionResult.project_id);
        var findOneKey = getKey('pages.findOne', actionResult.project_id, actionResult.id);

        if (shouldInvalidate(findAllKey, invalidations)) {
          request.server.methods.cache.invalidateKey(
            'pages',
            'findAll',
            [actionResult.project_id],
            request.tail('drop pages.findAll cache')
          );
        }

        if (shouldInvalidate(findOneKey, invalidations)) {
          request.server.methods.cache.invalidateKey(
            'pages',
            'findOne',
            [undefined, actionResult.id],
            request.tail('drop pages.findOne cache')
          );
        }
      },
      remove: function(request, actionResult, invalidations) {
        request.server.methods.cache.invalidateKey(
          'pages',
          'findAll',
          [actionResult.project_id],
          request.tail('drop pages.findAll cache')
        );

        request.server.methods.cache.invalidateKey(
          'pages',
          'findOne',
          [undefined, actionResult.id],
          request.tail('drop pages.findOne cache')
        );

        request.server.methods.cache.invalidateKey(
          'projects',
          'findOne',
          [actionResult.project_id, request.params.user],
          request.tail('drop projects.findOne cache')
        );
      }
    },
    elements: {
      create: elementInvalidations,
      update: elementInvalidations,
      remove: elementInvalidations
    }
  };

  function invalidateCaches(request, actionResults) {
    var invalidations = {};
    actionResults.forEach(function(result) {
      invalidationMap[result.type][result.method](request, result.rows[0], invalidations);
    });
  }

  server.method('bulk.getLookupData', getLookupData, { callback: false });
  server.method('bulk.getTxActionResult', getTxActionResult, { callback: false });
  server.method('bulk.getQueryValues', getQueryValues, { callback: false });
  server.method('bulk.generateEveryCallback', generateEveryCallback, { callback: false });
  server.method('bulk.invalidateCaches', invalidateCaches, { callback: false });
  done();
};

exports.register.attributes = {
  name: 'webmaker-bulk-api-methods'
};
