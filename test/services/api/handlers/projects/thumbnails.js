var requireTree = require('require-tree'),
  path = require('path'),
  projectConfigs = requireTree(path.resolve(__dirname + '../../../../../fixtures/configs/projects')),
  sinon = require('sinon'),
  nock = require('nock'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server;

function mockErr() {
  var e = new Error('relation does not exist');
  e.name = 'error';
  e.severity = 'ERROR';
  e.code = '42P01';
  return e;
}

before(function(done) {
  require('../../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  server.stop(done);
});

experiment('Automatic project thumbnail generation', function() {
  var screenshotMock;
  var screenshotVal1 = 'https://example.com/screenshot1.png';
  var screenshotVal2 = 'https://example.com/screenshot2.png';
  var screenshotVal3 = 'https://example.com/screenshot3.png';

  before(function(done) {
    // filteringPath used because of the time-dependent base64 string generated from the page render url
    screenshotMock = nock('https://webmaker-screenshot.example.com')
      .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
      .post(
        '/screenshotURL'
      )
      .once()
      .reply(200, {
        screenshot: screenshotVal1
      })
      .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
      .post(
        '/screenshotURL'
      )
      .once()
      .reply(200, {
        screenshot: screenshotVal2
      })
      .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
      .post(
        '/screenshotURL'
      )
      .once()
      .reply(200, {
        screenshot: screenshotVal3
      })
      .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
      .post(
        '/screenshotURL'
      )
      .once()
      .replyWithError('horrible network destroying monster of an error')
      .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
      .post(
        '/screenshotURL'
      )
      .once()
      .reply(503)
      .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
      .post(
        '/screenshotURL'
      )
      .once()
      .reply(200, {
        screenshot: screenshotVal3
      })
      .post(
        '/screenshotURL'
      )
      .once()
      .reply(200, {
        screenshot: screenshotVal3
      });
    done();
  });

  after(function(done) {
    screenshotMock.done();
    done();
  });

  test('updating the lowest page id in a project triggers a screenshot update', function(done) {
    var update = projectConfigs.thumbnails.success.update;
    var check = projectConfigs.thumbnails.success.check;

    server.on('tail', function(request) {
      if ( request.url.path !== update.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(check, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal1);
        done();
      });
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('Project update does not overwrite thumbnail', function(done) {
    var update = projectConfigs.thumbnails.noOverwrite.update;
    var check = projectConfigs.thumbnails.noOverwrite.check;
    var updateTitle = projectConfigs.thumbnails.noOverwrite.updateTitle;

    server.on('tail', function(request) {
      if ( request.url.path !== update.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(updateTitle, function(resp) {
        expect(resp.statusCode).to.equal(200);
        server.inject(check, function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal2);
          done();
        });
      });
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('updating (not) the lowest page id in a project does not trigger a screenshot update', function(done) {
    var update = projectConfigs.thumbnails.noUpdate.update;
    var check = projectConfigs.thumbnails.noUpdate.check;

    server.on('tail', function(request) {
      if ( request.url.path !== update.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(check, function(resp) {
        expect(resp.statusCode).to.equal(200);
        // should not be different from previous test
        expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal2);
        done();
      });
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('updating an element in the lowest page id in a project triggers a screenshot update', function(done) {
    var update = projectConfigs.thumbnails.elementSuccess.update;
    var check = projectConfigs.thumbnails.elementSuccess.check;

    server.on('tail', function(request) {
      if ( request.url.path !== update.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(check, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal3);
        done();
      });
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('updating an element that is (not) part of the lowest page id in a project ' +
    'does not trigger a screenshot update',
    function(done) {
      var update = projectConfigs.thumbnails.elementNoUpdate.update;
      var check = projectConfigs.thumbnails.elementNoUpdate.check;

      server.on('tail', function(request) {
        if ( request.url.path !== update.url ) {
          return;
        }
        server.removeAllListeners('tail');
        server.inject(check, function(resp) {
          expect(resp.statusCode).to.equal(200);
          // should not be different from previous test
          expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal3);
          done();
        });
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    }
  );

  test('checkPageId handles errors from pg', function(done) {
    var update = projectConfigs.thumbnails.fail;
    var stub = sinon.stub(server.methods.pages, 'min')
      .callsArgWith(1, mockErr());

    server.once('log', function(event, tags) {
      if ( !tags.error ) {
        return;
      }

      expect(event).to.exist();
      expect(event.data.details).to.startWith('Error querying DB for lowest page ID in project');
      stub.restore();
      done();
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('generateThumbnail handles errors from thumbnail service', function(done) {
    var update = projectConfigs.thumbnails.fail;

    server.once('log', function(event, tags) {
      if ( !tags.error ) {
        return;
      }

      expect(event).to.exist();
      expect(event.data.details).to.equal('Error requesting a new thumbnail from the screenshot service');
      done();
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('generateThumbnail handles non 200 statusCodes from thumbnail service', function(done) {
    var update = projectConfigs.thumbnails.fail;

    server.once('log', function(event, tags) {
      if ( !tags.error ) {
        return;
      }

      expect(event).to.exist();
      expect(event.data.details).to.equal('Thumbnail service returned 503');
      done();
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('updateThumbnail handles errors from pg', function(done) {
    var update = projectConfigs.thumbnails.fail;
    var stub = sinon.stub(server.methods.projects, 'updateThumbnail')
      .callsArgWith(1, mockErr());

    server.once('log', function(event, tags) {
      if ( !tags.error ) {
        return;
      }

      expect(event).to.exist();
      expect(event.data.details).to.equal('Error updating project thumbnail');
      stub.restore();
      done();
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });

  test('findOne tail cache drop error reported', function(done) {
    var update = projectConfigs.thumbnails.elementSuccess.update;
    var stub = sinon.stub(server.methods.projects.findOne.cache, 'drop')
      .callsArgWith(1, mockErr());

    server.on('tail', function(request) {
      if ( request.url.path !== update.url ) {
        return;
      }
      server.removeAllListeners('tail');
      stub.restore();
      done();
    });

    server.inject(update, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });
});

experiment('Automatic Thumbnail Generation Disabled', function() {
  test('server starts up without THUMBNAIL_SERVICE_URL defined', function(done) {
    var serviceURL = process.env.THUMBNAIL_SERVICE_URL;
    delete process.env.THUMBNAIL_SERVICE_URL;
    require('../../../../mocks/server')(function(testServer) {
      expect(testServer).to.exist();
      var config = projectConfigs.thumbnails.success.update;
      testServer.inject(config, function(resp) {
        expect(resp.statusCode).to.equal(200);
        process.env.THUMBNAIL_SERVICE_URL = serviceURL;
        done();
      });
    });
  });
});
