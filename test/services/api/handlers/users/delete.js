var configs = require('../../../../fixtures/configs/user-handlers'),
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

experiment('DELETE /users/{user}', function() {
  test('Deletes user record', function(done) {
    var opts = configs.del.success;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('deleted');
      done();
    });
  });

  test('404s if user not found', function(done) {
    var opts = configs.del.userNotFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('Insufficient permissions', function(done) {
    var opts = configs.del.unauthorized;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(401);
      expect(resp.result.error).to.equal('Unauthorized');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('find user pg error', function(done) {
    var opts = configs.del.fail;
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

  test('delete user pg error', function(done) {
    var opts = configs.del.fail2;
    var stub = sinon.stub(server.methods.users, 'remove')
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
