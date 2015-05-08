var configs = require('../../../fixtures/configs/project-handlers'),
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

experiment('Project Handlers', function() {
  experiment('pg plugin error handler', function() {
    test('Handles errors from postgre adapter', function(done) {
      var opts = configs.pgAdapter.fail;
      var stub = sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
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

  experiment('prequisites errors', function() {
    test('getUser pg error', function(done) {
      var opts = configs.prerequisites.fail;
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

    test('getProject pg error', function(done) {
      var opts = configs.prerequisites.fail;
      var stub = sinon.stub(server.methods.projects, 'findOne')
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

  experiment('GET - Discover', function() {
    test('default', function(done) {
      var opts = configs.get.discover.success.default;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        done();
      });
    });

    test('can change count', function(done) {
      var opts = configs.get.discover.success.changeCount;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(3);
        done();
      });
    });

    test('can change page', function(done) {
      var opts = configs.get.discover.success.changePage;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(3);
        done();
      });
    });

    test('returns 0 results when page out of range', function(done) {
      var opts = configs.get.discover.success.returnsNoneWhenPageTooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(0);
        done();
      });
    });

    test('count can not be negative', function(done) {
      var opts = configs.get.discover.fail.query.count.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be greater than 100', function(done) {
      var opts = configs.get.discover.fail.query.count.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be non-numeric', function(done) {
      var opts = configs.get.discover.fail.query.count.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be negative', function(done) {
      var opts = configs.get.discover.fail.query.page.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be greater than 50', function(done) {
      var opts = configs.get.discover.fail.query.page.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be non-numeric', function(done) {
      var opts = configs.get.discover.fail.query.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.discover.fail.error;
      var stub = sinon.stub(server.methods.projects, 'findFeatured')
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

  experiment('GET - one project (by user_id & id)', function() {
    test('returns a project', function(done) {
      var opts = configs.get.one.success;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.project).to.exist();
        expect(resp.result.project.id).to.equal('1');
        expect(resp.result.project.author.id).to.equal('1');
        done();
      });
    });

    test('404 user not found', function(done) {
      var opts = configs.get.one.fail.params.user.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('user param must be numeric', function(done) {
      var opts = configs.get.one.fail.params.user.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        console.log( resp.result.message );
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('404 project not found', function(done) {
      var opts = configs.get.one.fail.params.projects.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Project not found');
        done();
      });
    });

    test('project param must be numeric', function(done) {
      var opts = configs.get.one.fail.params.projects.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.one.fail.error;
      var stub = sinon.stub(server.methods.projects, 'findOne')
        .callsArgWith(1, mockErr());

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.be.a.string();
        stub.restore();
        done();
      });
    });
  });

  experiment('GET - All projects', function() {
    test('default', function(done) {
      var opts = configs.get.all.success.default;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        done();
      });
    });

    test('can change count', function(done) {
      var opts = configs.get.all.success.changeCount;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(3);
        done();
      });
    });

    test('can change page', function(done) {
      var opts = configs.get.all.success.changePage;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(3);
        done();
      });
    });

    test('returns 0 results when page out of range', function(done) {
      var opts = configs.get.all.success.returnsNoneWhenPageTooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(0);
        done();
      });
    });

    test('count can not be negative', function(done) {
      var opts = configs.get.all.fail.query.count.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be greater than 100', function(done) {
      var opts = configs.get.all.fail.query.count.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be non-numeric', function(done) {
      var opts = configs.get.all.fail.query.count.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be negative', function(done) {
      var opts = configs.get.all.fail.query.page.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be greater than 50', function(done) {
      var opts = configs.get.all.fail.query.page.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be non-numeric', function(done) {
      var opts = configs.get.all.fail.query.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.all.fail.error;
      var stub = sinon.stub(server.methods.projects, 'findAll')
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

  experiment('GET - All by user', function() {
    test('default', function(done) {
      var opts = configs.get.byUser.success.default;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        done();
      });
    });

    test('can change count', function(done) {
      var opts = configs.get.byUser.success.changeCount;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(3);
        done();
      });
    });

    test('can change page', function(done) {
      var opts = configs.get.byUser.success.changePage;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(1);
        done();
      });
    });

    test('returns 0 results when page out of range', function(done) {
      var opts = configs.get.byUser.success.returnsNoneWhenPageTooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(0);
        done();
      });
    });

    test('count can not be negative', function(done) {
      var opts = configs.get.byUser.fail.query.count.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be greater than 100', function(done) {
      var opts = configs.get.byUser.fail.query.count.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be non-numeric', function(done) {
      var opts = configs.get.byUser.fail.query.count.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be negative', function(done) {
      var opts = configs.get.byUser.fail.query.page.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be greater than 50', function(done) {
      var opts = configs.get.byUser.fail.query.page.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be non-numeric', function(done) {
      var opts = configs.get.byUser.fail.query.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.byUser.fail.error;
      var stub = sinon.stub(server.methods.projects, 'findUsersProjects')
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

  experiment('GET - remixes', function() {
    test('default', function(done) {
      var opts = configs.get.remixes.success.default;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        done();
      });
    });

    test('can change count', function(done) {
      var opts = configs.get.remixes.success.changeCount;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(3);
        done();
      });
    });

    test('can change page', function(done) {
      var opts = configs.get.remixes.success.changePage;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(2);
        done();
      });
    });

    test('returns 0 results when page out of range', function(done) {
      var opts = configs.get.remixes.success.returnsNoneWhenPageTooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.projects).to.exist();
        expect(resp.result.projects).to.be.an.array();
        expect(resp.result.projects.length).to.equal(0);
        done();
      });
    });

    test('count can not be negative', function(done) {
      var opts = configs.get.remixes.fail.query.count.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be greater than 100', function(done) {
      var opts = configs.get.remixes.fail.query.count.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('count can not be non-numeric', function(done) {
      var opts = configs.get.remixes.fail.query.count.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be negative', function(done) {
      var opts = configs.get.remixes.fail.query.page.negative;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be greater than 50', function(done) {
      var opts = configs.get.remixes.fail.query.page.tooHigh;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page can not be non-numeric', function(done) {
      var opts = configs.get.remixes.fail.query.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.remixes.fail.error;
      var stub = sinon.stub(server.methods.projects, 'findRemixes')
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

  experiment('Create', function() {
    experiment('New', function() {
      test('success, no thumbnail', function(done) {
        var opts = configs.create.new.success.withoutThumbnail;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.status).to.equal('created');
          expect(resp.result.project.id).to.exist();
          done();
        });
      });

      test('success, with thumbnail', function(done) {
        var opts = configs.create.new.success.withThumbnail;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.status).to.equal('created');
          expect(resp.result.project.id).to.exist();
          done();
        });
      });

      test('invalid title type', function(done) {
        var opts = configs.create.new.fail.payload.title;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(400);
          expect(resp.result.error).to.equal('Bad Request');
          expect(resp.result.message).to.be.a.string();
          done();
        });
      });

      test('invalid thumbnail type', function(done) {
        var opts = configs.create.new.fail.payload.thumb;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(400);
          expect(resp.result.error).to.equal('Bad Request');
          expect(resp.result.message).to.be.a.string();
          done();
        });
      });

      test('invalid thumbnail key value', function(done) {
        var opts = configs.create.new.fail.payload.thumbValue;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(400);
          expect(resp.result.error).to.equal('Bad Request');
          expect(resp.result.message).to.be.a.string();
          done();
        });
      });

      test('invalid thumbnail key name', function(done) {
        var opts = configs.create.new.fail.payload.thumbKey;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(400);
          expect(resp.result.error).to.equal('Bad Request');
          expect(resp.result.message).to.be.a.string();
          done();
        });
      });

      test('404 user not found', function(done) {
        var opts = configs.create.new.fail.params.user.notFound;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(404);
          expect(resp.result.error).to.equal('Not Found');
          expect(resp.result.message).to.equal('User not found');
          done();
        });
      });

      test('invalid user type', function(done) {
        var opts = configs.create.new.fail.params.user.notNumber;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(400);
          expect(resp.result.error).to.equal('Bad Request');
          expect(resp.result.message).to.be.a.string();
          done();
        });
      });

      test('cant create for different user', function(done) {
        var opts = configs.create.new.fail.auth.wrongUser;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(403);
          expect(resp.result.error).to.equal('Forbidden');
          expect(resp.result.message).to.equal('Insufficient permissions');
          done();
        });
      });

      test('handles errors from postgre', function(done) {
        var opts = configs.create.new.fail.error;
        var stub = sinon.stub(server.methods.projects, 'create')
          .callsArgWith(1, mockErr());

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(500);
          expect(resp.result.error).to.equal('Internal Server Error');
          expect(resp.result.message).to.be.a.string();
          stub.restore();
          done();
        });
      });
    });

    experiment('Remix', function() {
      test('success', function(done) {
        var opts = configs.create.remix.success.remix;
        var checkOpts = configs.create.remix.success.checkRemix;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.status).to.equal('created');
          expect(resp.result.project.id).to.exist();

          checkOpts.url = checkOpts.url.replace('$1', resp.result.project.id);
          server.inject(checkOpts, function(getResp) {
            expect(getResp.statusCode).to.equal(200);
            expect(getResp.result.status).to.equal('success');
            expect(getResp.result.project.id).to.equal(resp.result.project.id);
            expect(getResp.result.project.remixed_from).to.equal('2');
            done();
          });
        });
      });

      test('404 user not found', function(done) {
        var opts = configs.create.remix.fail.params.user.notFound;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(404);
          expect(resp.result.error).to.equal('Not Found');
          expect(resp.result.message).to.equal('User not found');
          done();
        });
      });

      test('invalid user type', function(done) {
        var opts = configs.create.remix.fail.params.user.notNumber;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(400);
          expect(resp.result.error).to.equal('Bad Request');
          expect(resp.result.message).to.be.a.string();
          done();
        });
      });

      test('404 project not found', function(done) {
        var opts = configs.create.remix.fail.params.project.notFound;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(404);
          expect(resp.result.error).to.equal('Not Found');
          expect(resp.result.message).to.equal('Project not found');
          done();
        });
      });

      test('invalid project type', function(done) {
        var opts = configs.create.remix.fail.params.project.notNumber;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(400);
          expect(resp.result.error).to.equal('Bad Request');
          expect(resp.result.message).to.be.a.string();
          done();
        });
      });

      test('handles errors from postgre', function(done) {
        var opts = configs.create.remix.fail.error;
        var stub = sinon.stub(server.methods.projects, 'create')
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
  });

  experiment('Patch - Update', function() {
    test('update title succeeds', function(done) {
      var opts = configs.patch.update.success.title;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.project.title).to.equal('new');
        done();
      });
    });

    test('update thumbnail succeeds', function(done) {
      var opts = configs.patch.update.success.thumb;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.project.thumbnail[400]).to.equal('new');
        done();
      });
    });

    test('update thumbnail (clearing it) succeeds', function(done) {
      var opts = configs.patch.update.success.clearThumb;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.project.thumbnail).to.exist();
        expect(resp.result.project.thumbnail[400]).to.not.exist();
        expect(resp.result.project.thumbnail[1024]).to.not.exist();
        done();
      });
    });

    test('update all succeeds', function(done) {
      var opts = configs.patch.update.success.all;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.project.title).to.equal('new2');
        expect(resp.result.project.thumbnail[400]).to.equal('new2');
        done();
      });
    });

    test('invalid user param', function(done) {
      var opts = configs.patch.update.fail.param.user;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('invalid project param', function(done) {
      var opts = configs.patch.update.fail.param.project;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('invalid title type', function(done) {
      var opts = configs.patch.update.fail.payload.title;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('invalid thumbnail type', function(done) {
      var opts = configs.patch.update.fail.payload.thumb;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('invalid thumbnail value type', function(done) {
      var opts = configs.patch.update.fail.payload.thumbValue;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('invalid thumbnail key', function(done) {
      var opts = configs.patch.update.fail.payload.thumbKey;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('cant update another user\'s project', function(done) {
      var opts = configs.patch.update.fail.auth.wrongUser;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(403);
        expect(resp.result.error).to.equal('Forbidden');
        expect(resp.result.message).to.equal('Insufficient permissions');
        done();
      });
    });

    test('moderator cant update another user\'s project', function(done) {
      var opts = configs.patch.update.fail.auth.wrongUser;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(403);
        expect(resp.result.error).to.equal('Forbidden');
        expect(resp.result.message).to.equal('Insufficient permissions');
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.patch.update.fail.error;
      var stub = sinon.stub(server.methods.projects, 'update')
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

  experiment('Feature', function() {
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
        expect(resp.result.project.id).to.equal('2');
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

  experiment('Delete', function() {
    test('success, owner', function(done) {
      var opts = configs.del.success.owner;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('deleted');
        done();
      });
    });

    test('success, moderator', function(done) {
      var opts = configs.del.success.moderator;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('deleted');
        done();
      });
    });

    test('404 user not found', function(done) {
      var opts = configs.del.fail.params.user.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('invalid user type', function(done) {
      var opts = configs.del.fail.params.user.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('404 project not found', function(done) {
      var opts = configs.del.fail.params.project.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Project not found');
        done();
      });
    });

    test('invalid project type', function(done) {
      var opts = configs.del.fail.params.project.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('cant delete for different user', function(done) {
      var opts = configs.del.fail.auth.notOwner;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(403);
        expect(resp.result.error).to.equal('Forbidden');
        expect(resp.result.message).to.equal('Insufficient permissions');
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.del.fail.error;
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
