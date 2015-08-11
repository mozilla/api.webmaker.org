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

experiment('POST /users/{user}/projects/{project}/pages', function() {
  test('successfully create page without providing styles param', function(done) {
    var opts = configs.create.success.emptyStyles;
    var created;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      created = resp.result.page.id;
      expect(created).to.exist();
      server.inject(
        '/users/1/projects/2/pages/' + created,
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal(created);
          expect(resp.result.page.x).to.equal(0);
          expect(resp.result.page.y).to.equal(0);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({});
          done();
        }
      );
    });
  });

  test('successfully create page with a styles object', function(done) {
    var opts = configs.create.success.withStyle;
    var created;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      created = resp.result.page.id;
      expect(created).to.exist();
      server.inject(
        '/users/1/projects/2/pages/' + created,
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal(created);
          expect(resp.result.page.x).to.equal(0);
          expect(resp.result.page.y).to.equal(1);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({ color: '#FF0000' });
          done();
        }
      );
    });
  });

  test('successfully create page with negative x & y', function(done) {
    var opts = configs.create.success.negativeXY;
    var created;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      created = resp.result.page.id;
      expect(created).to.exist();
      server.inject(
        '/users/1/projects/2/pages/' + created,
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal(created);
          expect(resp.result.page.x).to.equal(-1);
          expect(resp.result.page.y).to.equal(-1);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({});
          done();
        }
      );
    });
  });

  test('successfully create page with an x & y position that was deleted', function(done) {
    var opts = configs.create.success.deletedXY;
    var created;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      created = resp.result.page.id;
      expect(created).to.exist();
      server.inject(
        '/users/1/projects/2/pages/' + created,
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.page).to.exist();
          expect(resp.result.page.id).to.equal(created);
          expect(resp.result.page.x).to.equal(10);
          expect(resp.result.page.y).to.equal(10);
          expect(resp.result.page.styles).to.be.an.object();
          expect(resp.result.page.styles).to.deep.equal({});
          done();
        }
      );
    });
  });

  test('user not found', function(done) {
    var opts = configs.create.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('user not number', function(done) {
    var opts = configs.create.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user not integer', function(done) {
    var opts = configs.create.fail.params.user.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user does not own project', function(done) {
    var opts = configs.create.fail.params.user.doesNotOwnProject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not found', function(done) {
    var opts = configs.create.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('project not number', function(done) {
    var opts = configs.create.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not integer', function(done) {
    var opts = configs.create.fail.params.project.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('x not provided', function(done) {
    var opts = configs.create.fail.payload.x.notProvided;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('x not number', function(done) {
    var opts = configs.create.fail.payload.x.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('x not integer', function(done) {
    var opts = configs.create.fail.payload.x.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('y not provided', function(done) {
    var opts = configs.create.fail.payload.y.notProvided;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('y not number', function(done) {
    var opts = configs.create.fail.payload.y.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('y not integer', function(done) {
    var opts = configs.create.fail.payload.y.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('can not add a page into a project that has the same coord as another page in the project', function(done) {
    var opts = configs.create.fail.payload.xy.duplicateCoords;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('styles not object', function(done) {
    var opts = configs.create.fail.payload.styles.notObject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('can not create page in another user\'s project', function(done) {
    var opts = configs.create.fail.auth.wrongUser;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = configs.create.fail.error;
    var stub = sinon.stub(server.methods.pages, 'create')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.be.a.string();
      stub.restore();
      done();
    });
  });
});
