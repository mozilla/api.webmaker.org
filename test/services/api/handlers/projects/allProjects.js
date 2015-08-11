var configs = require('../../../../fixtures/configs/project-handlers'),
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

experiment('GET /projects', function() {
  test('default', function(done) {
    var opts = configs.get.all.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(10);
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
