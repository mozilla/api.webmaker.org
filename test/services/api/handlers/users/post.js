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

experiment('POST /users', function() {
  test('Creates a new user', function(done) {
    var opts = configs.create.success;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      expect(resp.result.user.id).to.equal('8');
      expect(resp.result.user.username).to.equal('newuser');
      expect(resp.result.user.locale.language).to.equal('en-CA');
      done();
    });
  });

  test('Does not allow duplicate usernames', function(done) {
    var opts = configs.create.duplicateUsername;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('Username taken');
      done();
    });
  });

  test('Does not allow duplicate ids', function(done) {
    var opts = configs.create.duplicateId;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('Duplicate user id');
      done();
    });
  });

  test('create user pg error', function(done) {
    var opts = configs.create.success;
    var stub = sinon.stub(server.methods.users, 'create')
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
