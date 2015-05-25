var Lab = require('lab'),
  nock = require('nock'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  validateFunc,
  identityMock;

var fixtures = require('./fixtures/tokenValidator');

before(function(done) {
  process.env.ID_SERVER_CONNECTION_STRING = 'https://webmaker-identity-example.com';
  validateFunc = require('../lib/tokenValidator');

  identityMock = nock('https://webmaker-identity-example.com')
    .get('/user')
    .matchHeader('authorization', 'token cade')
    .reply(200, fixtures.cade)
    .get('/user')
    .matchHeader('authorization', 'token fivehundred')
    .reply(500, {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    })
    .get('/user')
    .matchHeader('authorization', 'token fourohone')
    .reply(401)
    .get('/user')
    .matchHeader('authorization', 'token err')
    .replyWithError('something awful happened');

  done();
});

after(function(done) {
  delete process.env.ID_SERVER_CONNECTION_STRING;
  identityMock.done();
  done();
});

experiment('Token Validator', function() {
  test('Successfully handles 200 response', function(done) {
    validateFunc('cade', function(err, isValid, credentials) {
      expect(err).to.be.null();
      expect(isValid).to.be.true();
      expect(credentials).to.deep.equal(fixtures.cade);
      done();
    });
  });

  test('Passes request error object to callback', function(done) {
    validateFunc('err', function(err, isValid, credentials) {
      expect(err).to.exist();
      expect(isValid).to.be.undefined();
      expect(credentials).to.be.undefined();
      done();
    });
  });

  test('Passes 401 responses to callback', function(done) {
    validateFunc('fourohone', function(err, isValid, credentials) {
      expect(err).to.be.null();
      expect(isValid).to.be.false();
      expect(credentials).to.be.undefined();
      done();
    });
  });

  test('Passes non 200 and 401 responses to callback', function(done) {
    validateFunc('fivehundred', function(err, isValid, credentials) {
      expect(err).to.exist();
      expect(isValid).to.be.undefined();
      expect(credentials).to.be.undefined();
      done();
    });
  });
});
