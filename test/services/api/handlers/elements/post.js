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

experiment('POST /users/{user}/projects/{project}/pages/{page}/elements', function() {
  test('successfully create element without providing styles or attributes', function(done) {
    var opts = configs.create.success.emptyJSON;
    var created;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      created = resp.result.element.id;
      expect(created).to.exist();
      server.inject(
        '/users/1/projects/7/pages/6/elements/' + created,
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.element).to.exist();
          expect(resp.result.element.type).to.equal('text');
          expect(resp.result.element.attributes).to.be.an.object();
          expect(resp.result.element.attributes).to.deep.equal({});
          expect(resp.result.element.styles).to.be.an.object();
          expect(resp.result.element.styles).to.deep.equal({});
          done();
        }
      );
    });
  });

  test('successfully create element with provided style', function(done) {
    var opts = configs.create.success.withStyle;
    var created;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      created = resp.result.element.id;
      expect(created).to.exist();
      server.inject(
        '/users/1/projects/7/pages/6/elements/' + created,
        function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.element).to.exist();
          expect(resp.result.element.type).to.equal('text');
          expect(resp.result.element.attributes).to.be.an.object();
          expect(resp.result.element.attributes).to.deep.equal({});
          expect(resp.result.element.styles).to.be.an.object();
          expect(resp.result.element.styles).to.deep.equal({ color: '#FF0000' });
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

  test('page not found', function(done) {
    var opts = configs.create.fail.params.page.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Page not found');
      done();
    });
  });

  test('page not number', function(done) {
    var opts = configs.create.fail.params.page.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page not integer', function(done) {
    var opts = configs.create.fail.params.page.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('type not provided', function(done) {
    var opts = configs.create.fail.payload.type.notProvided;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('type not string', function(done) {
    var opts = configs.create.fail.payload.type.notString;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('attributes not object', function(done) {
    var opts = configs.create.fail.payload.attributes.notObject;

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

  test('Handles errors from postgre', function(done) {
    var opts = configs.create.fail.error;
    var stub = sinon.stub(server.methods.elements, 'create')
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
