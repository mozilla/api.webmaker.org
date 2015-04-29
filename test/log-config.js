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
  experiment('Defualt', function() {
    before(function(done) {
      delete process.env.LOG_LEVEL;
      done();
    });
    test('sets a default log level', function(done) {
      var conf = logConfig();
      expect(conf.level).to.equal('info');
      expect(conf.console).to.exist();
      expect(conf.console.color).to.equal(true);
      done();
    });
  });

  experiment('Console logging', function() {
    before(function(done) {
      process.env.LOG_LEVEL = 'info';
      done();
    });
    test('Enabled by default', function(done) {
      var conf = logConfig();
      expect(conf.level).to.equal('info');
      expect(conf.console).to.exist();
      expect(conf.console.color).to.equal(true);
      expect(conf.file).to.not.exist();
      done();
    });
  });

  experiment('Console logging disabled', function() {
    before(function(done) {
      process.env.NO_CONSOLE = 'true';
      done();
    });

    test('Enabled by default', function(done) {
      var conf = logConfig();
      expect(conf.level).to.equal('info');
      expect(conf.console).to.not.exist();
      done();
    });
  });
});
