var configs = require('../../../../fixtures/configs/page-handlers'),
  sinon = require('sinon'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server,
  thumbnailServiceUrl;

function mockErr() {
  var e = new Error('relation does not exist');
  e.name = 'error';
  e.severity = 'ERROR';
  e.code = '42P01';
  return e;
}

before(function(done) {
  thumbnailServiceUrl = process.env.THUMBNAIL_SERVICE_URL;
  delete process.env.THUMBNAIL_SERVICE_URL;
  require('../../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  process.env.THUMBNAIL_SERVICE_URL = thumbnailServiceUrl;
  server.stop(done);
});

experiment('PATCH /users/{user}/projects/{projects}/pages/{page}', function() {
  test('succeeds with only x in payload', function(done) {
    var opts = configs.patch.success.onlyX;

    server.on('tail', function(request) {
      if ( request.url.path !== opts.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(
        '/users/1/projects/1/pages/1',
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal('1');
          expect(resp.result.page.x).to.equal(12);
          expect(resp.result.page.y).to.equal(0);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({});
          done();
        }
      );
    });

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
    });
  });

  test('succeeds with only y in payload', function(done) {
    var opts = configs.patch.success.onlyY;

    server.on('tail', function(request) {
      if ( request.url.path !== opts.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(
        '/users/1/projects/1/pages/1',
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal('1');
          expect(resp.result.page.x).to.equal(12);
          expect(resp.result.page.y).to.equal(12);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({});
          done();
        }
      );
    });

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
    });
  });

  test('succeeds with only styles in payload', function(done) {
    var opts = configs.patch.success.onlyStyles;

    server.on('tail', function(request) {
      if ( request.url.path !== opts.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(
        '/users/1/projects/1/pages/1',
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal('1');
          expect(resp.result.page.x).to.equal(12);
          expect(resp.result.page.y).to.equal(12);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({
            color: '#00FF00'
          });
          done();
        }
      );
    });

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
    });
  });

  test('succeeds with all payload params', function(done) {
    var opts = configs.patch.success.all;

    server.on('tail', function(request) {
      if ( request.url.path !== opts.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(
        '/users/1/projects/1/pages/1',
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal('1');
          expect(resp.result.page.x).to.equal(10);
          expect(resp.result.page.y).to.equal(10);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({
            color: '#0000FF'
          });
          done();
        }
      );
    });

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
    });
  });

  test('user not found', function(done) {
    var opts = configs.patch.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('user not number', function(done) {
    var opts = configs.patch.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user not integer', function(done) {
    var opts = configs.patch.fail.params.user.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user does not own project', function(done) {
    var opts = configs.patch.fail.params.user.doesNotOwnProject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not found', function(done) {
    var opts = configs.patch.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('project not number', function(done) {
    var opts = configs.patch.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not integer', function(done) {
    var opts = configs.patch.fail.params.project.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page not found', function(done) {
    var opts = configs.patch.fail.params.page.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Page not found');
      done();
    });
  });

  test('page not number', function(done) {
    var opts = configs.patch.fail.params.page.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page not integer', function(done) {
    var opts = configs.patch.fail.params.page.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page is not part of project', function(done) {
    var opts = configs.patch.fail.params.project.pageNotInProject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('x not number', function(done) {
    var opts = configs.patch.fail.payload.x.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('x not integer', function(done) {
    var opts = configs.patch.fail.payload.x.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('y not number', function(done) {
    var opts = configs.patch.fail.payload.y.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('y not integer', function(done) {
    var opts = configs.patch.fail.payload.y.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('can not update a page with existing coords', function(done) {
    var opts = configs.patch.fail.payload.xy.duplicateCoords;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('styles not object', function(done) {
    var opts = configs.patch.fail.payload.styles.notObject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('missing all', function(done) {
    var opts = configs.patch.fail.payload.missingAll;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = configs.patch.fail.error;
    var stub = sinon.stub(server.methods.pages, 'update')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.be.a.string();
      stub.restore();
      done();
    });
  });

  test('pages tail cache error reported', function(done) {
    var opts = configs.patch.fail.error;
    var stub = sinon.stub(server.methods.pages.findOne.cache, 'drop')
      .callsArgWith(1, mockErr());

    server.on('tail', function(request) {
      if ( request.url.path !== opts.url ) {
        return;
      }
      server.removeAllListeners('tail');
      stub.restore();
      done();
    });

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });
});
