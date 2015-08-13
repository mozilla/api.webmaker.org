var requireTree = require('require-tree'),
  path = require('path'),
  projectConfigs = requireTree(path.resolve(__dirname + '../../../../../fixtures/configs/projects')),
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

experiment('DELETE /users/{user}/projects/{project}', function() {
  test('success, owner', function(done) {
    var opts = projectConfigs.remove.success.owner;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('deleted');
      done();
    });
  });

  test('success, moderator', function(done) {
    var opts = projectConfigs.remove.success.moderator;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('deleted');
      done();
    });
  });

  test('404 user not found', function(done) {
    var opts = projectConfigs.remove.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('invalid user type', function(done) {
    var opts = projectConfigs.remove.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('404 project not found', function(done) {
    var opts = projectConfigs.remove.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('invalid project type', function(done) {
    var opts = projectConfigs.remove.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('cant delete for different user', function(done) {
    var opts = projectConfigs.remove.fail.auth.notOwner;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = projectConfigs.remove.fail.error;
    var stub = sinon.stub(server.methods.projects, 'remove')
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
