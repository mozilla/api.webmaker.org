var requireTree = require('require-tree'),
  path = require('path'),
  elementConfigs = requireTree(path.resolve(__dirname + '../../../../../fixtures/configs/elements')),
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

experiment('GET /users/{user}/projects/{project}/pages/{page}/elements/{element}', function() {
  test('success', function(done) {
    var opts = elementConfigs.get.one.success;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.element).to.be.an.object();
      expect(resp.result.element.id).to.equal('1');
      expect(resp.result.element.page_id).to.equal('1');
      expect(resp.result.element.attributes).to.be.an.object();
      expect(resp.result.element.attributes).to.deep.equal({});
      expect(resp.result.element.styles).to.be.an.object();
      expect(resp.result.element.styles).to.deep.equal({});
      expect(resp.result.element.history).to.be.an.object();
      expect(resp.result.element.history.created_at).to.be.a.date();
      expect(resp.result.element.history.updated_at).to.be.a.date();
      done();
    });
  });

  test('user not found', function(done) {
    var opts = elementConfigs.get.one.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('user not number', function(done) {
    var opts = elementConfigs.get.one.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user not integer', function(done) {
    var opts = elementConfigs.get.one.fail.params.user.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user does not own project', function(done) {
    var opts = elementConfigs.get.one.fail.params.user.doesNotOwnProject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not found', function(done) {
    var opts = elementConfigs.get.one.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('project not number', function(done) {
    var opts = elementConfigs.get.one.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not integer', function(done) {
    var opts = elementConfigs.get.one.fail.params.project.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page not found', function(done) {
    var opts = elementConfigs.get.one.fail.params.page.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Page not found');
      done();
    });
  });

  test('page not number', function(done) {
    var opts = elementConfigs.get.one.fail.params.page.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page not integer', function(done) {
    var opts = elementConfigs.get.one.fail.params.page.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('element not found', function(done) {
    var opts = elementConfigs.get.one.fail.params.element.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Element not found');
      done();
    });
  });

  test('element not number', function(done) {
    var opts = elementConfigs.get.one.fail.params.element.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('element not integer', function(done) {
    var opts = elementConfigs.get.one.fail.params.element.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = elementConfigs.get.one.fail.error;
    var stub = sinon.stub(server.methods.elements, 'findOne')
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
