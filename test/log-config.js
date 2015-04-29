var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  test = lab.test,
  expect = require('code').expect;

var logConfig = require('../lib/log-config');

before(function(done) {
  process.env.LOG_LEVEL = 'info';
  done();
});

experiment('Logging Configuration', function() {
  experiment('Default', function() {
    test('sets a default log level', function(done) {
      var conf = logConfig();
      expect(conf.logger).to.exist();
      done();
    });
  });

  experiment('Default', function() {
    before(function(done) {
      delete process.env.LOG_LEVEL;
      done();
    });
    test('sets a default log level', function(done) {
      var conf = logConfig();
      expect(conf.logger).to.exist();
      done();
    });
  });
});
