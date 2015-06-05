
exports.register = function(server, options, done) {
  var url = require('url');
  var qs = require('querystring');
  var request = require('request');
  var thumnailServiceUrl = process.env.THUMBNAIL_SERVICE_URL;
  var pageRenderUrl = process.env.PAGE_RENDER_URL;
  var req;

  function buildPageRenderUrl(user, project, page) {
    var urlObj = url.parse(pageRenderUrl);

    urlObj.hash = '#/thumbnail?' + qs.encode({
      user: user,
      project: project,
      page: page
    });

    return '/mobile-center-cropped/small/webmaker-desktop/' + new Buffer(url.format(urlObj)).toString('base64');
  }

  function updateThumbnail(project, url, tail) {
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

        tail();
      }
    );
  }

  function generateThumbnail(row, tail) {
    req({
      url: buildPageRenderUrl(row.user_id, row.project_id, row.page_id)
    }, function(err, resp, body) {
      if ( err ) {
        server.log('error', {
          details: 'Error requesting a new thumnail from the screenshot service',
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

      updateThumbnail(row.project_id, body.screenshot, tail);
    });
  }

  // Check if the given page has the lowest id in its parent project
  // If it is, then request a new thumbnail
  function checkPageId(page, tail) {
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

      if ( row.page_id !== page.id ) {
        server.debug('Thumbnail update not required');
        return tail();
      }

      server.debug('Updating thumbnail for project');
      generateThumbnail(row, tail);
    });
  }

  // this becomes the server method if no thumbnail service is defined.
  function skipCheck(page, tail) {
    tail();
  }

  var updateStrategy;

  if ( thumnailServiceUrl ) {
    server.debug('Automatic thumbnail updates enabled, using: ' + thumnailServiceUrl);

    updateStrategy = checkPageId;

    req = request.defaults({
      baseUrl: thumnailServiceUrl,
      method: 'post',
      json: true,
      headers: {
        accept: 'application/json'
      },
      body: {
        wait: true
      }
    });
  } else {
    server.debug('Automatic thumbnail updates disabled. define THUMBNAIL_SERVICE_URL to enable');
    updateStrategy = skipCheck;
  }

  server.method('projects.checkPageId', updateStrategy);
  done();
};

exports.register.attributes = {
  name: 'webmaker-thumnails',
  version: '1.0.0'
};
