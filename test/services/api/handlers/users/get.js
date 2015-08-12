var requireTree = require('require-tree'),
  path = require('path'),
  userConfigs = requireTree(path.resolve(__dirname + '../../../../../fixtures/configs/users')),
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

experiment('GET /users/{user}', function() {
  test('Gets user data', function(done) {
    var opts = userConfigs.get.success;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');

      var user = resp.result.user;
      expect(user.id).to.equal('1');
      expect(user.username).to.equal('chris_testing');
      expect(user.locale).to.be.an.object();
      expect(user.history).to.be.an.object();
      expect(user.permissions).to.be.an.object();
      expect(user.permissions.moderator).to.be.false();
      expect(user.permissions.staff).to.be.false();
      done();
    });
  });

  test('404s with invalid id', function(done) {
    var opts = userConfigs.get.invalidId;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('401 if fetching another account', function(done) {
    var opts = userConfigs.get.notYourAccount;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(401);
      expect(resp.result.error).to.equal('Unauthorized');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('find user pg error', function(done) {
    var opts = userConfigs.get.success;
    var stub = sinon.stub(server.methods.users, 'find')
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
