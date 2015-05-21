var configs = require('../../../fixtures/configs/user-handlers'),
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
  require('../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  server.stop(done);
});

experiment('User Handlers', function() {
  experiment('Create', function() {
    test('Creates a new user', function(done) {
      var opts = configs.create.success;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        expect(resp.result.user.id).to.equal('5');
        expect(resp.result.user.username).to.equal('newuser');
        expect(resp.result.user.locale.language).to.equal('en');
        expect(resp.result.user.locale.country).to.equal('CA');
        done();
      });
    });

    test('Creates a new user - no language', function(done) {
      var opts = configs.create.noLang;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        expect(resp.result.user.id).to.equal('7');
        expect(resp.result.user.username).to.equal('newuser2');
        expect(resp.result.user.locale.language).to.equal('en');
        expect(resp.result.user.locale.country).to.equal('CA');
        done();
      });
    });

    test('Creates a new user - no country', function(done) {
      var opts = configs.create.noCountry;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        expect(resp.result.user.id).to.equal('8');
        expect(resp.result.user.username).to.equal('newuser3');
        expect(resp.result.user.locale.language).to.equal('en');
        expect(resp.result.user.locale.country).to.equal('US');
        done();
      });
    });

    test('Must provide id', function(done) {
      var opts = configs.create.noId;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.exist();
        done();
      });
    });

    test('id must be numeric', function(done) {
      var opts = configs.create.idNotNumeric;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.exist();
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

  experiment('Get', function() {
    test('Gets user data', function(done) {
      var opts = configs.get.success;

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
      var opts = configs.get.invalidId;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('401 if fetching another account', function(done) {
      var opts = configs.get.notYourAccount;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(401);
        expect(resp.result.error).to.equal('Unauthorized');
        expect(resp.result.message).to.equal('Insufficient permissions');
        done();
      });
    });

    test('find user pg error', function(done) {
      var opts = configs.get.success;
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

  experiment('Patch', function() {
    test('Updates user record', function(done) {
      var opts = configs.patch.updateEverything;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.user.username).to.equal('changed');
        expect(resp.result.user.locale.language).to.equal('es');
        expect(resp.result.user.locale.country).to.equal('US');
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
        expect(resp.result.user.locale.language).to.equal('es');
        expect(resp.result.user.locale.country).to.equal('US');
        done();
      });
    });

    test('Updates only language', function(done) {
      var opts = configs.patch.language;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.user.username).to.equal('changedAgain');
        expect(resp.result.user.locale.language).to.equal('fr');
        expect(resp.result.user.locale.country).to.equal('US');
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
  });

  experiment('Delete', function() {
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

  experiment('Options', function() {
    test('responds to options requests', function(done) {
      var opts = configs.options.success;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        done();
      });
    });
  });
});
