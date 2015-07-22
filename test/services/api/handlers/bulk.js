var bulkConfig = require('../../../fixtures/configs/bulk-handlers'),
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

experiment('Bulk Projects API', function() {
  test('Succeeds - single action', function(done) {
    var opts = bulkConfig.success.singleAction;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });

  test('Succeeds - multiple actions, defaults jsonb fields', function(done) {
    var opts = bulkConfig.success.multiAction;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });

  test('Succeeds - update existing data', function(done) {
    var opts = bulkConfig.success.updateExisting;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });

  test('Succeeds - with provided jsonb fields', function(done) {
    var opts = bulkConfig.success.thumbnailsStylesAttributes;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });

  test('Returns 400 if result reference is out of array bounds', function(done) {
    var opts = bulkConfig.failure.pipelineIndexOutOfBounds;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.message).to.contain('Array reference out of bounds');
      done();
    });
  });

  test('Returns 400 if user has insufficient permissions for an action ', function(done) {
    var opts = bulkConfig.failure.insufficientPermissions;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.message).to.contain('Insufficient permissions to execute action at index');
      done();
    });
  });

  test('Returns 400 if validation lookup does not return rows' , function(done) {
    var opts = bulkConfig.failure.lookupNotFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.message).to.contain('not found for action at index');
      done();
    });
  });

  test('Returns 400 if result reference is invalid (undef, null, function, etc)', function(done) {
    var opts = bulkConfig.failure.invalidObjectReference;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.message).to.contain('Invalid reference to value');
      done();
    });
  });

  test('Returns 400 if result reference is invalid (undef, null, function, etc)', function(done) {
    var opts = bulkConfig.failure.queryFailure;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.message).to.contain('failed to execute query');
      done();
    });
  });

  test('responds to options requests', function(done) {
    var opts = bulkConfig.options;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });

  test('Handles error from pg when making a transaction', function(done) {
    var opts = bulkConfig.failure.postgreNoTransaction;
    var clientStub = {
      query: sinon.stub()
    };

    clientStub.query.onFirstCall()
      .callsArgWith(1, userFixtures.chris_testing);

    sinon.stub(server.plugins['webmaker-postgre-adapter'].pg, 'connect')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      server.plugins['webmaker-postgre-adapter'].pg.connect.restore();
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.equal('An internal server error occurred');
      done();
    });
  });

  test('handles error if rollback query fails', function(done) {
    var opts = bulkConfig.failure.rollbackFailure;
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
      .callsArgWith(1, mockErr());

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
});
