var configs = require('../../../../fixtures/configs/project-handlers'),
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

experiment('PATCH /users/{user}/projects/{project}/feature', function() {
  test('features a project', function(done) {
    var opts = configs.patch.feature.success.feature;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      expect(resp.result.project.id).to.equal('1');
      expect(resp.result.project.featured).to.be.true();
      done();
    });
  });

  test('unfeatures a featured a project', function(done) {
    var opts = configs.patch.feature.success.unfeature;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      expect(resp.result.project.id).to.equal('4');
      expect(resp.result.project.featured).to.be.false();
      done();
    });
  });

  test('404 user not found', function(done) {
    var opts = configs.patch.feature.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('user can not be non-numeric', function(done) {
    var opts = configs.patch.feature.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('404 project not found', function(done) {
    var opts = configs.patch.feature.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('project can not be non-numeric', function(done) {
    var opts = configs.patch.feature.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('must be moderator', function(done) {
    var opts = configs.patch.feature.fail.auth.notMod;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = configs.patch.feature.fail.error;
    var stub = sinon.stub(server.methods.projects, 'feature')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.equal('An internal server error occurred');
      stub.restore();
      done();
    });
  });
});
