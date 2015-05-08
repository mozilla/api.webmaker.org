var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect;

var auth = require('../lib/auth-config');

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

  experiment('Validation Function', function() {
    test('returns true for valid token', function(done) {
      auth.validateFunc('validToken', function(err, result, tokenData) {
        expect(result).to.be.true();
        expect(tokenData).to.exist();
        expect(tokenData.scope).to.include('user', 'project');
        expect(tokenData.user_id).to.equal(1);
        done();
      });
    });

    test('returns false for invalid token', function(done) {
      auth.validateFunc('invalidToken', function(err, result, tokenData) {
        expect(result).to.be.false();
        expect(tokenData).to.not.exist();
        done();
      });
    });
  });
});
