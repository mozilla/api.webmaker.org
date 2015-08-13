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

experiment('GET - one project, shallow', function() {
  test('default', function(done) {
    var opts = projectConfigs.get.findOneShallow.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.project).to.exist();
      expect(resp.result.project).to.be.an.object();
      expect(resp.result.project.author).to.be.an.object();
      done();
    });
  });

  test('project does not exist', function(done) {
    var opts = projectConfigs.get.findOneShallow.fail.doesNotExist;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('project id must a number', function(done) {
    var opts = projectConfigs.get.findOneShallow.fail.badIdType;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      done();
    });
  });

  test('handles errors from postgre', function(done) {
    var opts = projectConfigs.get.findOneShallow.fail.internalError;
    var stub = sinon.stub(server.methods.projects, 'findOneShallow')
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
