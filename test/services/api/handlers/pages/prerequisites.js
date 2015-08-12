var requireTree = require('require-tree'),
  path = require('path'),
  pageConfigs = requireTree(path.resolve(__dirname + '../../../../../fixtures/configs/pages')),
  sinon = require('sinon'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server,
  thumbnailServiceUrl;

function mockErr() {
  var e = new Error('relation does not exist');
  e.name = 'error';
  e.severity = 'ERROR';
  e.code = '42P01';
  return e;
}

before(function(done) {
  thumbnailServiceUrl = process.env.THUMBNAIL_SERVICE_URL;
  delete process.env.THUMBNAIL_SERVICE_URL;
  require('../../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  process.env.THUMBNAIL_SERVICE_URL = thumbnailServiceUrl;
  server.stop(done);
});

experiment('Pages prerequisites errors', function() {
  test('getPage pg error', function(done) {
    var opts = pageConfigs.prerequisites.fail;
    var stub = sinon.stub(server.methods.pages, 'findOne')
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
