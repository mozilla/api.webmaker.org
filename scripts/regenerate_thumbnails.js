require('habitat').load();

var Hoek = require('hoek');

Hoek.assert(process.env.PAGE_RENDER_URL, 'Must define PAGE_RENDER_URL');
Hoek.assert(process.env.POSTGRE_CONNECTION_STRING, 'Must define POSTGRE_CONNECTION_STRING');
Hoek.assert(process.env.THUMBNAIL_SERVICE_URL, 'Must define THUMBNAIL_SERVICE_URL');

try {
  var pg = require('pg').native;
} catch (ex) {
  console.warn('Native pg bindings failed to load or are not installed:', ex);
  pg = require('pg');
  console.warn('Connected to pg using non-native bindings.\n');
}

// u.id = 249
var filter = process.argv[2] ? ' AND ' + process.argv[2] + " " : "";
var select_sql = 'SELECT users.id AS user_id, projects.id AS project_id, MIN(pages.id) AS page_id FROM users ' +
                 'JOIN projects ON users.id = projects.user_id JOIN pages ON projects.id = pages.project_id ' +
                 'WHERE users.deleted_at IS NULL AND projects.deleted_at IS NULL AND pages.deleted_at IS NULL' +
                 filter + 'GROUP BY users.id, projects.id;';
var update_sql = 'UPDATE projects SET thumbnail = $1 WHERE deleted_at IS NULL AND id = $2;';

pg.connect(process.env.POSTGRE_CONNECTION_STRING, function(connect_error, client, release) {
  if (connect_error) {
    throw connect_error;
  }

  client.query(select_sql, function(select_error, result) {
    release();

    if (select_error) {
      throw select_error;
    }

    console.log("Found %s rows to update", result.rowCount);
    screenshot_q.push(result.rows);
  });
});

var Async = require('async');
var QS = require('querystring');
var Request = require('request').defaults({
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
var URL = require("url");
var time = Date.now();

var screenshot_q = Async.queue(function(task, q_callback) {
  // Build render URL
  var urlObj = URL.parse(process.env.PAGE_RENDER_URL);

  urlObj.hash = '#/thumbnail?' + QS.encode({
    user: task.user_id,
    project: task.project_id,
    page: task.page_id,
    t: time
  });

  var screenshot_url = '/mobile-center-cropped/small/webmaker-desktop/' + new Buffer(URL.format(urlObj)).toString('base64');

  // Generate a screenshot
  Request({
    url: screenshot_url
  }, function(request_error, response, body) {
    if (request_error) {
      throw request_error;
    }

    if (response.statusCode !== 200) {
      throw new Error("Screenshot service returned HTTP " + response.statusCode);
    }

    var thumbnail = JSON.stringify({
      "320": body.screenshot
    });

    pg.connect(process.env.POSTGRE_CONNECTION_STRING, function(connect_error, client, release) {
      if (connect_error) {
        throw connect_error;
      }

      client.query(update_sql, [thumbnail, task.project_id], function(update_error, results) {
        release();

        if (update_error) {
          throw update_error;
        }

        if (results.rowCount === 1) {
          console.log('Updated /users/%s/projects/%s thumbnail = %s', task.user_id, task.project_id, thumbnail);
        }
        q_callback();
      });
    });
  });
}, 1);

screenshot_q.drain = function() {
  console.log("Thumbnail queue empty. Nice job!");
  process.exit(0);
};
