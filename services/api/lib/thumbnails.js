
exports.register = function(server, options, done) {
  var url = require('url');
  var qs = require('querystring');
  var request = require('request');
  var pageRenderUrl = process.env.PAGE_RENDER_URL;

  var req = request.defaults({
    baseUrl: process.env.THUMBNAIL_SERVICE_URL,
    method: 'post',
    json: true,
    headers: {
      accept: 'application/json'
    },
    body: {
      wait: true
    }
  });

  function buildPageRenderUrl(user, project, page) {
    var urlObj = url.parse(pageRenderUrl);

    urlObj.hash = '#/thumbnail?' + qs.encode({
      user: user,
      project: project,
      page: page,
      t: Date.now()
    });

    return '/mobile-center-cropped/small/webmaker-desktop/' + new Buffer(url.format(urlObj)).toString('base64');
  }

  function updateThumbnail(project, user, url, tail) {
    server.methods.projects.updateThumbnail(
      [
        JSON.stringify({
          320: url
        }),
        project
      ],
      function(err, result) {
        if ( err ) {
          server.log('error', {
            details: 'Error updating project thumbnail',
            error: err
          });
        }

        server.methods.cache.invalidateKey(
          'projects',
          'findOne',
          [project, user],
          tail
        );
      }
    );
  }

  function generateThumbnail(row, tail) {
    req({
      url: buildPageRenderUrl(row.user_id, row.project_id, row.page_id)
    }, function(err, resp, body) {
      if ( err ) {
        server.log('error', {
          details: 'Error requesting a new thumbnail from the screenshot service',
          error: err
        });
        return tail();
      }

      if ( resp.statusCode !== 200 ) {
        server.log('error', {
          details: 'Thumbnail service returned ' + resp.statusCode,
          error: body
        });
        return tail(new Error('Thumbnail update failed'));
      }

      updateThumbnail(row.project_id, row.user_id, body.screenshot, tail);
    });
  }

  // Check if the given page has the lowest id of all pages in its parent project
  // In most cases, this means the first page created when a project is created (situated at 0,0)
  function checkPageId(page, tail) {
    process.nextTick(function() {
      if ( !process.env.THUMBNAIL_SERVICE_URL ) {
        return tail();
      }
      server.methods.pages.min([
        page.project_id
      ], function(err, result) {
        if ( err ) {
          server.log('error', {
            details: 'Error querying DB for lowest page ID in project: ' + page.project_id,
            error: err
          });
          return tail(err);
        }

        var row = result.rows[0];

        if ( !row || row.page_id !== page.id ) {
          server.debug('Thumbnail update not required');
          return tail();
        }

        server.debug('Updating thumbnail for project');
        generateThumbnail(row, tail);
      });
    });
  }

  // project updates, and any kind of delete don't trigger thumbnail changes.
  function filterRawResult(result) {
    return result.type !== 'projects' && result.method !== 'remove';
  }

  // extract just the page_id and project_id from the result data
  function transformResult(result) {
    var rowData = result.rows[0];
    var projectId = rowData.project_id;
    var pageId = rowData.page_id || rowData.id;

    return {
      project_id: +projectId,
      page_id: +pageId
    };
  }

  // reduce the array of actions into an array of checks to perform, to determine if a thumbnail update is required
  function reduceIntoUpdates(pendingChecks, result) {
    var resultData;

    // iterate over existing thumbnail updates for comparisons with current action
    for (var i = 0; i < pendingChecks.length; i++) {
      resultData = pendingChecks[i];
      if (resultData.project_id !== result.project_id) {
        continue;
      }
      if (result.page_id < resultData.page_id) {
        break;
      }
      return pendingChecks;
    }

    pendingChecks.push(result);
    return pendingChecks;
  }

  // pass each resulting action into checkPageId, generating a request tail
  // for each check (we don't want to block the request on these checks)
  function checkAction(request, action) {
    checkPageId(action, request.tail('updating project thumbnail'));
  }

  // We need only check if a thumbnail update is necessary for the lowest pageId in a given set of actions
  function processBulkThumbnailRequests(request, rawResults) {
    rawResults.filter(filterRawResult)
    .map(transformResult)
    .reduce(reduceIntoUpdates, [])
    .forEach(checkAction.bind(this, request));
  }

  server.method('projects.checkPageId', checkPageId, {
    callback: false
  });
  server.method('projects.processBulkThumbnailRequests', processBulkThumbnailRequests, {
    callback: false
  });
  done();
};

exports.register.attributes = {
  name: 'webmaker-thumbnails',
  version: '1.0.0'
};
