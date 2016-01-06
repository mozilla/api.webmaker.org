var configs = require('../../../fixtures/configs/tags'),
  sinon = require('sinon'),
  // nock = require('nock'),
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
  require('../../../mocks/server')(function(s) {
    server = s;
    done();
  });
});

after(function(done) {
  server.stop(done);
});

experiment('Project Tags', function() {
  test('Get Projects with tag', function(done) {
    var get = configs.get.success;
    server.inject(get, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(2);
      done();
    });
  });

  test('Get Projects with tag error', function(done) {
    var get = configs.get.success;
    sinon.stub(server.methods.projects, 'findWithTags')
      .callsArgWith(1, mockErr());

    server.inject(get, function(resp) {
      server.methods.projects.findWithTags.restore();
      expect(resp.statusCode).to.equal(500);
      done();
    });
  });
});
