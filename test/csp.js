var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect;

var csp = require('../lib/csp');

experiment('Content Security Policy', function() {
  experiment('defaultSrc', function() {
    test('allows none', function(done) {
      expect(csp.defaultSrc).to.include('none');
      done();
    });
  });

  experiment('styleSrc', function() {
    test('allows self', function(done) {
      expect(csp.styleSrc).to.include('self');
      done();
    });
    test('allows boostrap CDN', function(done) {
      expect(csp.styleSrc).to.include('netdna.bootstrapcdn.com');
      done();
    });
  });

  experiment('fontSrc', function() {
    test('allows boostrap CDN', function(done) {
      expect(csp.fontSrc).to.include('netdna.bootstrapcdn.com');
      done();
    });
  });
});
