var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect;

var locale = require('../../services/api/lib/locale');
var languages = require('../fixtures/languages');

experiment('Locales', function() {
  experiment('languages', function() {
    test('allows self', function(done) {
      var failures = [];

      languages.forEach(function (language) {
        if (!locale.languageRegex.test(language)) {
          failures.push(language);
        }
      });

      expect(failures).to.deep.equal([]);
      done();
    });
  });
});
