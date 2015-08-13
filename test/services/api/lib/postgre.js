var pgConfig = require('../../../fixtures/configs/postgre'),
  userFixtures = require('../../../fixtures/users'),
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

experiment('pg plugin error handler', function() {
  test('Handles errors from postgre adapter', function(done) {
    var opts = pgConfig.fail;
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
    var opts = pgConfig.createFail;
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
    var opts = pgConfig.createFail;
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
    var opts = pgConfig.createFail;
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
    var opts = pgConfig.createFail;
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
    var opts = pgConfig.createFail;
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
    var opts = pgConfig.remixFail;

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
    var opts = pgConfig.remixFail;

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
    var opts = pgConfig.remixFail;
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
    var opts = pgConfig.remixFail;

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
