var BPromise = require('bluebird');

exports.register = function(server, options, done) {
  var queryValuesMap =  {
    projects: {
      create: function(userId, data) {
        return [
          userId,
          null,
          server.methods.utils.version(),
          data.title,
          JSON.stringify(data.thumbnail || {})
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
          JSON.stringify(data.styles || {})
        ];
      },
      update: function(userId, data) {
        return [
          data.x,
          data.y,
          JSON.stringify(data.styles || {}),
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
          JSON.stringify(data.attributes || {}),
          JSON.stringify(data.styles || {})
        ];
      },
      update: function(userId, data) {
        return [
          JSON.stringify(data.styles || {}),
          JSON.stringify(data.attributes || {}),
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
        var result = results[i];
        if (
          result.method === 'create' &&
          result.type === type &&
          result.id === id )
        {
          return result;
        }
      }
  }

  server.method('bulk.getLookupData', getLookupData, { callback: false });
  server.method('bulk.getTxActionResult', getTxActionResult, { callback: false });
  server.method('bulk.getQueryValues', getQueryValues, { callback: false });
  done();
};

exports.register.attributes = {
  name: 'webmaker-bulk-api-methods'
};
