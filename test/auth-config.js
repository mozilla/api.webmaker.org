var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect;

// provide an empty validateFunc for hapi-auth-bearer-token
var auth = require('../lib/auth-config')(function() {});

experiment('Authentication Config', function() {
  experiment('Default', function() {
    test('Does not allow token in search query', function(done) {
      expect(auth.allowQueryToken).to.equal(false);
      done();
    });

    test('Has Token Validation Function', function(done) {
      expect(auth.validateFunc).to.be.a.function();
      done();
    });

    test('Has tokenType Defined', function(done) {
      expect(auth.tokenType).to.equal('token');
      done();
    });
  });
});
