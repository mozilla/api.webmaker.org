var configs = require('../../../fixtures/configs/user-handlers'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server;

before(function(done) {
  require('../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  server.stop(done);
});

experiment('User Handler', function() {
  experiment('Create', function() {
    test('Creates a new user', function(done) {
      var opts = configs.create.success;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        expect(resp.result.user.id).to.equal(3);
        done();
      });
    });

    test('Does not allow dupicate usernames', function(done) {
      var opts = configs.create.duplicateUsername;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.equal('Username taken');
        done();
      });
    });

    test('handles errors from pg', function(done) {
      var opts = configs.create.pgError;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
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
        expect(user.id).to.equal(1);
        expect(user.username).to.equal('cade');
        expect(user.locale).to.be.an.object();
        expect(user.history).to.be.an.object();
        expect(user.permissions).to.be.an.object();
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

    test('handles errors from pg', function(done) {
      var opts = configs.get.pgError;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
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
  });

  experiment('Patch', function() {
    test('Updates user record', function(done) {
      var opts = configs.patch.updateEverything;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.user.username).to.equal('changed');
        expect(resp.result.user.language).to.equal('es');
        expect(resp.result.user.country).to.equal('US');
        done();
      });
    });

    test('Updates only username', function(done) {
      var opts = configs.patch.username;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.user.username).to.equal('changedAgain');
        expect(resp.result.user.language).to.equal('es');
        expect(resp.result.user.country).to.equal('US');
        done();
      });
    });

    test('Updates only language', function(done) {
      var opts = configs.patch.language;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.user.username).to.equal('changedAgain');
        expect(resp.result.user.language).to.equal('fr');
        expect(resp.result.user.country).to.equal('US');
        done();
      });
    });

    test('handles errors fetching user', function(done) {
      var opts = configs.patch.pgFetchError;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('handles errors updating user', function(done) {
      var opts = configs.patch.pgUpdateError;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
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

    test('handles errors fetching user', function(done) {
      var opts = configs.del.pgFetchError;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('handles errors deleting user', function(done) {
      var opts = configs.del.pgDeleteError;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
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
