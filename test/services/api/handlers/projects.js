var configs = require('../../../fixtures/configs/project-handlers'),
  userFixtures = require('../../../fixtures/users'),
  sinon = require('sinon'),
  nock = require('nock'),
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

    test('Handles error from pg when making a transaction', function(done) {
      var opts = configs.pgAdapter.createFail;
      var clientStub = {
        query: sinon.stub()
      };

      clientStub.query.onFirstCall()
        .callsArgWith(1, userFixtures.chris_testing);

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, null, clientStub, function() {})
        .onSecondCall()
        .callsArgWith(1, mockErr());

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        done();
      });
    });

    test('handles error if begin query fails', function(done) {
      var opts = configs.pgAdapter.createFail;
      var clientStub = {
        query: sinon.stub()
      };

      clientStub.query.onFirstCall()
        .callsArgWith(1, userFixtures.chris_testing)
        .onSecondCall()
        .callsArgWith(1, mockErr())
        .onThirdCall()
        .callsArgWith(1, null, {});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, null, clientStub, function() {});

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        done();
      });
    });

    test('handles error if executeTransaction query fails', function(done) {
      var opts = configs.pgAdapter.createFail;
      var clientStub = {
        query: sinon.stub()
      };

      clientStub.query
        .onFirstCall().callsArgWith(1, userFixtures.chris_testing)
        .onSecondCall().callsArgWith(1, null, {})
        .onThirdCall().callsArgWith(1, mockErr())
        .onCall(3).callsArgWith(1, null)
        .onCall(4).callsArgWith(1, null, {});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, null, clientStub, function() {});

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        done();
      });
    });

    test('handles error if commit query fails', function(done) {
      var opts = configs.pgAdapter.createFail;
      var clientStub = {
        query: sinon.stub()
      };

      clientStub.query
        .onFirstCall().callsArgWith(1, userFixtures.chris_testing)
        .onSecondCall().callsArgWith(1, null, {})
        .onThirdCall().callsArgWith(1, null, { rows: [{ id: '1' }] })
        .onCall(3).callsArgWith(1, null, {})
        .onCall(4).callsArgWith(1, mockErr())
        .onCall(5).callsArgWith(1, null, {});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, null, clientStub, function() {});

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        done();
      });
    });

    test('handles error if rollback query fails', function(done) {
      var opts = configs.pgAdapter.createFail;
      var clientStub = {
        query: sinon.stub()
      };

      clientStub.query.onFirstCall()
        .callsArgWith(1, userFixtures.chris_testing)
        .onSecondCall()
        .callsArgWith(1, null, {})
        .onThirdCall()
        .callsArgWith(1, null, {})
        .onCall(3)
        .callsArgWith(1, mockErr())
        .onCall(4)
        .callsArgWith(1, null, {});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, null, clientStub, function() {});

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        done();
      });
    });

    test('remix transaction error', function(done) {
      var opts = configs.pgAdapter.remixFail;

      sinon.stub(server.methods.users, 'find')
        .callsArgWith(1, null, { rows: [ userFixtures.chris_testing ] });

      sinon.stub(server.methods.projects, 'findDataForRemix')
        .callsArgWith(1, null, { rows: [ {} ] });

      sinon.stub(server.methods.utils, 'formatRemixData')
        .returns({});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, mockErr());

      server.inject(opts, function(resp) {
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        server.methods.users.find.restore();
        server.methods.projects.findDataForRemix.restore();
        server.methods.utils.formatRemixData.restore();
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('Handles error from pg when creating a transaction (remixing)', function(done) {
      var opts = configs.pgAdapter.remixFail;

      sinon.stub(server.methods.users, 'find')
        .callsArgWith(1, null, { rows: [ userFixtures.chris_testing ] });

      sinon.stub(server.methods.projects, 'findDataForRemix')
        .callsArgWith(1, null, { rows: [ {} ] });

      sinon.stub(server.methods.utils, 'formatRemixData')
        .returns({});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, mockErr());

      server.inject(opts, function(resp) {
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        server.methods.users.find.restore();
        server.methods.projects.findDataForRemix.restore();
        server.methods.utils.formatRemixData.restore();
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('Handles error from pg after rolling back a transaction (remixing)', function(done) {
      var opts = configs.pgAdapter.remixFail;
      var clientStub = {
        query: sinon.stub()
      };

      clientStub.query.onFirstCall()
        .onFirstCall().callsArgWith(1, userFixtures.chris_testing)
        .onSecondCall().callsArgWith(1, null, { rows: [ {} ] })
        .onThirdCall().callsArgWith(1, null, { rows: [{ id: '1' }] })
        .onCall(3).callsArgWith(1, null, { rows: [{ id: '1' }] })
        .onCall(4).callsArgWith(1, mockErr())
        .onCall(5).callsArgWith(1, null, {});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .callsArgWith(1, null, clientStub, function() {});

      server.inject(opts, function(resp) {
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
        done();
      });
    });

    test('Handles error if rollback fails (remixing)', function(done) {
      var opts = configs.pgAdapter.remixFail;

      sinon.stub(server.methods.users, 'find')
        .callsArgWith(1, null, { rows: [ userFixtures.chris_testing ] });

      sinon.stub(server.methods.projects, 'findDataForRemix')
        .callsArgWith(1, null, { rows: [ {} ] });

      sinon.stub(server.methods.utils, 'formatRemixData')
        .returns({});

      sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
        .onFirstCall()
        .callsArgWith(1, null, {})
        .onSecondCall()
        .callsArgWith(1, mockErr());

      server.inject(opts, function(resp) {
        server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
        server.methods.users.find.restore();
        server.methods.projects.findDataForRemix.restore();
        server.methods.utils.formatRemixData.restore();
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.equal('An internal server error occurred');
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
        expect(resp.result.projects.length).to.equal(2);
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
          expect(resp.result.project.title).to.equal('create_test');
          expect(resp.result.project.version).to.equal('test');
          expect(resp.result.project.remixed_from).to.be.null();
          expect(resp.result.project.featured).to.be.false();
          expect(resp.result.project.history).to.exist();
          expect(resp.result.project.history).to.include(['created_at', 'updated_at']);
          expect(resp.result.project.thumbnail).to.be.an.object();
          expect(resp.result.project.thumbnail).to.not.include(['400', '1024']);
          expect(resp.result.page.id).to.exist();
          expect(resp.result.page.project_id).to.equal(resp.result.project.id);
          expect(resp.result.page.x).to.equal(0);
          expect(resp.result.page.y).to.equal(0);
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

      test('Creates new user from token', function(done) {
        var opts = configs.create.new.success.userFromToken;

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

      test('Title length > 256 characters', function(done) {
        var opts = configs.create.new.fail.payload.titleLength;

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

      test('new user from token - handles errors from postgre', function(done) {
        var opts = configs.create.new.fail.auth.userFromToken;
        var stub = sinon.stub(server.methods.users, 'create')
          .callsArgWith(1, mockErr());

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(500);
          expect(resp.result.error).to.equal('Internal Server Error');
          expect(resp.result.message).to.be.a.string();
          stub.restore();
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
      before(function(done) {
        // clear remix data cache
        server.methods.cache.invalidateKey('projects', 'findDataForRemix', [1], done);
      });

      test('success', function(done) {
        var opts = configs.create.remix.success.remix;
        var checkRemixProject = configs.create.remix.success.checkRemixProject;
        var checkRemixPages = configs.create.remix.success.checkRemixPages;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.status).to.equal('remixed');
          var projectId = resp.result.project.id;
          expect(projectId).to.exist();
          checkRemixProject.url = checkRemixProject.url.replace('$1', projectId);
          checkRemixPages.url = checkRemixPages.url.replace('$1', projectId);
          server.inject(checkRemixProject, function(projectResp) {
            expect(projectResp.statusCode).to.equal(200);
            expect(projectResp.result.project.author.id).to.equal('2');
            expect(projectResp.result.status).to.equal('success');
            expect(projectResp.result.project.id).to.equal(projectId);
            expect(projectResp.result.project.title).to.equal('test_project_1');
            expect(projectResp.result.project.remixed_from).to.equal('1');
            server.inject(checkRemixPages, function(pagesResp) {
              expect(pagesResp.statusCode).to.equal(200);
              expect(pagesResp.result.status).to.equal('success');
              expect(pagesResp.result.pages).to.be.an.array();
              expect(pagesResp.result.pages.length).to.equal(3);
              expect(pagesResp.result.pages[0].elements.length).to.equal(4);
              expect(pagesResp.result.pages[1].elements.length).to.equal(6);
              var fixedLink = pagesResp.result.pages[0].elements[1];
              var wasAlreadyBrokenLink = pagesResp.result.pages[1].elements[0];
              var otherFixedLink = pagesResp.result.pages[1].elements[2];
              expect(fixedLink.attributes.targetUserId).to.equal('2');
              expect(fixedLink.attributes.targetProjectId).to.equal(projectId);
              expect(fixedLink.attributes.targetPageId).to.equal('26');
              expect(wasAlreadyBrokenLink.attributes.targetUserId).to.equal('2');
              expect(wasAlreadyBrokenLink.attributes.targetProjectId).to.equal(projectId);
              // original project page deleted/missing, targetPageId was deleted
              expect(wasAlreadyBrokenLink.attributes.targetPageId).to.not.exist();
              expect(otherFixedLink.attributes.targetUserId).to.equal('2');
              expect(otherFixedLink.attributes.targetProjectId).to.equal(projectId);
              expect(otherFixedLink.attributes.targetPageId).to.equal('25');
              done();
            });
          });
        });
      });

      test('can remix project as a new user', function(done) {
        var opts = configs.create.remix.success.newUserFromRemix;

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(200);
          done();
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
        var stub = sinon.stub(server.methods.projects, 'remix')
          .callsArgWith(2, mockErr());

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(500);
          expect(resp.result.error).to.equal('Internal Server Error');
          expect(resp.result.message).to.equal('An internal server error occurred');
          stub.restore();
          done();
        });
      });

      test('handles error if findDataForRemix fails', function(done) {
        var opts = configs.create.remix.fail.error;
        var stub = sinon.stub(server.methods.projects, 'findDataForRemix')
          .callsArgWith(1, mockErr());

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(500);
          expect(resp.result.error).to.equal('Internal Server Error');
          expect(resp.result.message).to.equal('An internal server error occurred');
          stub.restore();
          done();
        });
      });

      test('handles error if getTokenUserFails', function(done) {
        var opts = configs.create.remix.fail.newUserFromRemix;
        sinon.stub(server.methods.users, 'find')
          .onFirstCall()
          .callsArgWith(1, null, {
            rows: [userFixtures.chris_testing]
          })
          .onSecondCall()
          .callsArgWith(1, mockErr());

        server.inject(opts, function(resp) {
          expect(resp.statusCode).to.equal(500);
          expect(resp.result.error).to.equal('Internal Server Error');
          expect(resp.result.message).to.equal('An internal server error occurred');
          server.methods.users.find.restore();
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

    test('update with a thumbnail object succeeds, does not update thumbnail', function(done) {
      var opts = configs.patch.update.success.withThumbnailKey;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        expect(resp.result.project.title).to.equal('newww');
        expect(resp.result.project.thumbnail[320]).to.not.equal('will not work');
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
    test('Title length > 256 characters', function(done) {
        var opts = configs.patch.update.fail.payload.titleLength;

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

    test('project tail cache error reported', function(done) {
      var opts = configs.patch.update.fail.error;
      var stub = sinon.stub(server.methods.projects.findOne.cache, 'drop')
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

  experiment('Update Thumbnail Tails', function() {
    var screenshotMock;
    var screenshotVal1 = 'https://example.com/screenshot1.png';
    var screenshotVal2 = 'https://example.com/screenshot2.png';
    var screenshotVal3 = 'https://example.com/screenshot3.png';

    before(function(done) {
      // filteringPath used because of the time-dependent base64 string generated from the page render url
      screenshotMock = nock('https://webmaker-screenshot.example.com')
        .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
        .post(
          '/screenshotURL'
        )
        .once()
        .reply(200, {
          screenshot: screenshotVal1
        })
        .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
        .post(
          '/screenshotURL'
        )
        .once()
        .reply(200, {
          screenshot: screenshotVal2
        })
        .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
        .post(
          '/screenshotURL'
        )
        .once()
        .reply(200, {
          screenshot: screenshotVal3
        })
        .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
        .post(
          '/screenshotURL'
        )
        .once()
        .replyWithError('horrible network destroying monster of an error')
        .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
        .post(
          '/screenshotURL'
        )
        .once()
        .reply(503)
        .filteringPath(/^\/mobile-center-cropped\/small\/webmaker-desktop\/(.+)$/, '/screenshotURL')
        .post(
          '/screenshotURL'
        )
        .once()
        .reply(200, {
          screenshot: screenshotVal3
        })
        .post(
          '/screenshotURL'
        )
        .once()
        .reply(200, {
          screenshot: screenshotVal3
        });
      done();
    });

    after(function(done) {
      screenshotMock.done();
      done();
    });

    test('updating the lowest page id in a project triggers a screenshot update', function(done) {
      var update = configs.tail.success.update;
      var check = configs.tail.success.check;

      server.on('tail', function(request) {
        if ( request.url.path !== update.url ) {
          return;
        }
        server.removeAllListeners('tail');
        server.inject(check, function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal1);
          done();
        });
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('Project update does not overwrite thumbnail', function(done) {
      var update = configs.tail.noOverwrite.update;
      var check = configs.tail.noOverwrite.check;
      var updateTitle = configs.tail.noOverwrite.updateTitle;

      server.on('tail', function(request) {
        if ( request.url.path !== update.url ) {
          return;
        }
        server.removeAllListeners('tail');
        server.inject(updateTitle, function(resp) {
          expect(resp.statusCode).to.equal(200);
          server.inject(check, function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal2);
            done();
          });
        });
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('updating (not) the lowest page id in a project does not trigger a screenshot update', function(done) {
      var update = configs.tail.noUpdate.update;
      var check = configs.tail.noUpdate.check;

      server.on('tail', function(request) {
        if ( request.url.path !== update.url ) {
          return;
        }
        server.removeAllListeners('tail');
        server.inject(check, function(resp) {
          expect(resp.statusCode).to.equal(200);
          // should not be different from previous test
          expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal2);
          done();
        });
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('updating an element in the lowest page id in a project triggers a screenshot update', function(done) {
      var update = configs.tail.elementSuccess.update;
      var check = configs.tail.elementSuccess.check;

      server.on('tail', function(request) {
        if ( request.url.path !== update.url ) {
          return;
        }
        server.removeAllListeners('tail');
        server.inject(check, function(resp) {
          expect(resp.statusCode).to.equal(200);
          expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal3);
          done();
        });
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('updating an element that is (not) part of the lowest page id in a project ' +
      'does not trigger a screenshot update',
      function(done) {
        var update = configs.tail.elementNoUpdate.update;
        var check = configs.tail.elementNoUpdate.check;

        server.on('tail', function(request) {
          if ( request.url.path !== update.url ) {
            return;
          }
          server.removeAllListeners('tail');
          server.inject(check, function(resp) {
            expect(resp.statusCode).to.equal(200);
            // should not be different from previous test
            expect(resp.result.project.thumbnail[320]).to.equal(screenshotVal3);
            done();
          });
        });

        server.inject(update, function(resp) {
          expect(resp.statusCode).to.equal(200);
        });
      }
    );

    test('checkPageId handles errors from pg', function(done) {
      var update = configs.tail.fail;
      var stub = sinon.stub(server.methods.pages, 'min')
        .callsArgWith(1, mockErr());

      server.once('log', function(event, tags) {
        if ( !tags.error ) {
          return;
        }

        expect(event).to.exist();
        expect(event.data.details).to.startWith('Error querying DB for lowest page ID in project');
        stub.restore();
        done();
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('generateThumbnail handles errors from thumbnail service', function(done) {
      var update = configs.tail.fail;

      server.once('log', function(event, tags) {
        if ( !tags.error ) {
          return;
        }

        expect(event).to.exist();
        expect(event.data.details).to.equal('Error requesting a new thumbnail from the screenshot service');
        done();
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('generateThumbnail handles non 200 statusCodes from thumbnail service', function(done) {
      var update = configs.tail.fail;

      server.once('log', function(event, tags) {
        if ( !tags.error ) {
          return;
        }

        expect(event).to.exist();
        expect(event.data.details).to.equal('Thumbnail service returned 503');
        done();
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('updateThumbnail handles errors from pg', function(done) {
      var update = configs.tail.fail;
      var stub = sinon.stub(server.methods.projects, 'updateThumbnail')
        .callsArgWith(1, mockErr());

      server.once('log', function(event, tags) {
        if ( !tags.error ) {
          return;
        }

        expect(event).to.exist();
        expect(event.data.details).to.equal('Error updating project thumbnail');
        stub.restore();
        done();
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });

    test('findOne tail cache drop error reported', function(done) {
      var update = configs.tail.elementSuccess.update;
      var stub = sinon.stub(server.methods.projects.findOne.cache, 'drop')
        .callsArgWith(1, mockErr());

      server.on('tail', function(request) {
        if ( request.url.path !== update.url ) {
          return;
        }
        server.removeAllListeners('tail');
        stub.restore();
        done();
      });

      server.inject(update, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });
  });

  experiment('Thumbnail updating disabled', function() {
    test('server starts up without THUMBNAIL_SERVICE_URL defined', function(done) {
      var serviceURL = process.env.THUMBNAIL_SERVICE_URL;
      delete process.env.THUMBNAIL_SERVICE_URL;
      require('../../../mocks/server')(function(testServer) {
        expect(testServer).to.exist();
        var config = configs.tail.success.update;
        testServer.inject(config, function(resp) {
          expect(resp.statusCode).to.equal(200);
          process.env.THUMBNAIL_SERVICE_URL = serviceURL;
          done();
        });
      });
    });
  });
});
