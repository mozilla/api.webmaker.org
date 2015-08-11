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

experiment('PATCH /users/{user}', function() {
  test('Updates user record', function(done) {
    var opts = configs.patch.updateEverything;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      expect(resp.result.user.username).to.equal('changed');
      expect(resp.result.user.locale.language).to.equal('es-US');
      expect(resp.result.user.permissions.staff).to.be.false();
      expect(resp.result.user.permissions.moderator).to.be.false();
      done();
    });
  });

  test('Updates only username', function(done) {
    var opts = configs.patch.username;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      expect(resp.result.user.username).to.equal('changedAgain');
      expect(resp.result.user.locale.language).to.equal('es-US');
      done();
    });
  });

  test('Updates only language', function(done) {
    var opts = configs.patch.language;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      expect(resp.result.user.username).to.equal('changedAgain');
      expect(resp.result.user.locale.language).to.equal('fr-CA');
      done();
    });
  });

  test('404s with invalid id', function(done) {
    var opts = configs.patch.userNotFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('401 if updating wrong account', function(done) {
    var opts = configs.patch.unauthorized;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(401);
      expect(resp.result.error).to.equal('Unauthorized');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('Does not allow duplicate usernames', function(done) {
    var opts = configs.patch.duplicateUsername;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.equal('Username taken');
      done();
    });
  });

  test('find user pg error', function(done) {
    var opts = configs.patch.updateEverything;
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

  test('update user pg error', function(done) {
    var opts = configs.patch.updateEverything;
    var stub = sinon.stub(server.methods.users, 'update')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.equal('An internal server error occurred');
      stub.restore();
      done();
    });
  });

  test('user tail cache error reported', function(done) {
    var opts = configs.patch.updateEverything;
    var stub = sinon.stub(server.methods.users.find.cache, 'drop')
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
