var Lab = require('lab'),
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
      var opts = {
        url: '/api/users',
        method: 'post',
        payload: {
          username: 'newuser',
          language: 'en',
          country: 'CA'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        expect(resp.result.user.id).to.equal(3);
        done();
      });
    });

    test('Does not allow dupicate usernames', function(done) {
      var opts = {
        url: '/api/users',
        method: 'post',
        payload: {
          username: 'cade',
          language: 'en',
          country: 'CA'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.equal('Username taken');
        done();
      });
    });

    test('handles errors from pg', function(done) {
      var opts = {
        url: '/api/users',
        method: 'post',
        payload: {
          username: 'error',
          language: 'en',
          country: 'CA'
        }
      };

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
      var opts = {
        url: '/api/users/1',
        method: 'get',
        headers: {
          authorization: 'token validToken'
        }
      };

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
      var opts = {
        url: '/api/users/4',
        method: 'get',
        headers: {
          authorization: 'token validToken'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('handles errors from pg', function(done) {
      var opts = {
        url: '/api/users/5',
        method: 'get',
        headers: {
          authorization: 'token validToken'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('401 if fetching another account', function(done) {
      var opts = {
        url: '/api/users/2',
        method: 'get',
        headers: {
          authorization: 'token validToken'
        }
      };

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
      var opts = {
        url: '/api/users/1',
        method: 'patch',
        headers: {
          authorization: 'token validToken'
        },
        payload: {
          username: 'changed',
          language: 'es',
          country: 'US'
        }
      };

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
      var opts = {
        url: '/api/users/1',
        method: 'patch',
        headers: {
          authorization: 'token validToken'
        },
        payload: {
          username: 'changedAgain'
        }
      };

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
      var opts = {
        url: '/api/users/1',
        method: 'patch',
        headers: {
          authorization: 'token validToken'
        },
        payload: {
          language: 'fr'
        }
      };

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
      var opts = {
        url: '/api/users/5',
        method: 'patch',
        headers: {
          authorization: 'token validToken'
        },
        payload: {
          username: 'changed',
          language: 'es',
          country: 'US'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('handles errors updating user', function(done) {
      var opts = {
        url: '/api/users/1',
        method: 'patch',
        headers: {
          authorization: 'token validToken'
        },
        payload: {
          username: 'error',
          language: 'es',
          country: 'US'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('404s with invalid id', function(done) {
      var opts = {
        url: '/api/users/4',
        method: 'patch',
        headers: {
          authorization: 'token validToken'
        },
        payload: {
          username: 'error',
          language: 'es',
          country: 'US'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('401 if updating wrong account', function(done) {
      var opts = {
        url: '/api/users/2',
        method: 'patch',
        headers: {
          authorization: 'token validToken'
        },
        payload: {
          username: 'changed',
          language: 'es',
          country: 'US'
        }
      };

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
      var opts = {
        url: '/api/users/1',
        method: 'delete',
        headers: {
          authorization: 'token validToken'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('deleted');
        done();
      });
    });

    test('404s if user not found', function(done) {
      var opts = {
        url: '/api/users/4',
        method: 'delete',
        headers: {
          authorization: 'token validToken'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('handles errors fetching user', function(done) {
      var opts = {
        url: '/api/users/5',
        method: 'delete',
        headers: {
          authorization: 'token validToken'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('handles errors deleting user', function(done) {
      var opts = {
        url: '/api/users/2',
        method: 'delete',
        headers: {
          authorization: 'token validToken2'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('Insufficient permissions', function(done) {
      var opts = {
        url: '/api/users/1',
        method: 'delete',
        headers: {
          authorization: 'token validToken2'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(401);
        expect(resp.result.error).to.equal('Unauthorized');
        expect(resp.result.message).to.equal('Insufficient permissions');
        done();
      });
    });
  });

  experiment('Options', function() {
    test('Deletes user record', function(done) {
      var opts = {
        url: '/api/users/1',
        method: 'options',
        headers: {
          authorization: 'token validToken'
        }
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        done();
      });
    });
  });
});
