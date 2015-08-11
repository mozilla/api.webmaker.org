var Lab = require('lab'),
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

experiment('Docs', function() {
  experiment('Get', function() {
    test('GET / redirects to /docs', function(done) {
      var opts = {
        url: '/',
        method: 'get'
      };

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(302);
        expect(resp.headers.location).to.equal('/docs');
        done();
      });
    });
  });
});
