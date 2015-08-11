var configs = require('../../../../fixtures/configs/element-handlers'),
  sinon = require('sinon'),
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

experiment('PATCH /users/{user}/projects/{project}/pages/{page}/elements/{element}', function() {
  test('succeeds with only styles in payload', function(done) {
    var opts = configs.patch.success.onlyStyles;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      server.inject(
        '/users/1/projects/1/pages/1/elements/1',
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.element).to.exist();
          expect(resp.result.element.id).to.equal('1');
          expect(resp.result.element.styles).to.be.an.object();
          expect(resp.result.element.styles).to.deep.equal({ color: '#FF0000' });
          expect(resp.result.element.attributes).to.be.an.object();
          expect(resp.result.element.attributes).to.deep.equal({});
          done();
        }
      );
    });
  });

  test('succeeds with only attributes in payload', function(done) {
    var opts = configs.patch.success.onlyAttributes;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      server.inject(
        '/users/1/projects/1/pages/1/elements/1',
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.element).to.exist();
          expect(resp.result.element.id).to.equal('1');
          expect(resp.result.element.styles).to.be.an.object();
          expect(resp.result.element.styles).to.deep.equal({ color: '#FF0000' });
          expect(resp.result.element.attributes).to.be.an.object();
          expect(resp.result.element.attributes).to.deep.equal({ value: 'hello world' });
          done();
        }
      );
    });
  });

  test('succeeds with attributes and styles in payload', function(done) {
    var opts = configs.patch.success.all;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      server.inject(
        '/users/1/projects/1/pages/1/elements/1',
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.element).to.exist();
          expect(resp.result.element.id).to.equal('1');
          expect(resp.result.element.styles).to.be.an.object();
          expect(resp.result.element.styles).to.deep.equal({ color: '#0000FF' });
          expect(resp.result.element.attributes).to.be.an.object();
          expect(resp.result.element.attributes).to.deep.equal({ value: 'world, hello' });
          done();
        }
      );
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

  test('element not found', function(done) {
    var opts = configs.patch.fail.params.element.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Element not found');
      done();
    });
  });

  test('element not number', function(done) {
    var opts = configs.patch.fail.params.element.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('element not integer', function(done) {
    var opts = configs.patch.fail.params.element.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('attributes not object', function(done) {
    var opts = configs.patch.fail.payload.attributes.notObject;

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

  test('missing all payload keys', function(done) {
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
    var stub = sinon.stub(server.methods.elements, 'update')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.be.a.string();
      stub.restore();
      done();
    });
  });

  test('element tail cache error reported', function(done) {
    var opts = configs.patch.fail.error;
    var stub = sinon.stub(server.methods.elements.findOne.cache, 'drop')
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
