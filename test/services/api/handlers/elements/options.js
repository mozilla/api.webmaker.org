var configs = require('../../../../fixtures/configs/element-handlers'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server;

before(function(done) {
  require('../../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  server.stop(done);
});

experiment('OPTIONS /users/{user}/projects/{project}/pages/{page}/elements/{element}', function() {
  test('responds to options requests', function(done) {
    var opts = configs.options.success;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });
});
