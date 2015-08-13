var requireTree = require('require-tree'),
  path = require('path'),
  projectConfigs = requireTree(path.resolve(__dirname + '../../../../../fixtures/configs/projects')),
  sinon = require('sinon'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server;

function mockErr() {
  var e = new Error('relation does not exist');
  e.name = 'error';
  e.severity = 'ERROR';
  e.code = '42P01';
  return e;
}

before(function(done) {
  require('../../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  server.stop(done);
});

experiment('GET /discover/{lang}', function() {
  test('default', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.default;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      done();
    });
  });

  test('can change language to en-GB', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.changeLanguageENGB;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(10);
      expect(resp.result.projects[0].author.locale.language).to.be.a.string();
      expect(resp.result.projects[0].author.locale.language).to.equal('en-GB');
      expect(resp.result.projects[1].author.locale.language).to.be.a.string();
      expect(resp.result.projects[1].author.locale.language).to.equal('en-GB');
      expect(resp.result.projects[2].author.locale.language).to.be.a.string();
      expect(resp.result.projects[2].author.locale.language).to.equal('en-GB');
      expect(resp.result.projects[3].author.locale.language).to.be.a.string();
      expect(resp.result.projects[3].author.locale.language).to.not.equal('en-GB');

      done();
    });
  });

  test('can change language to bn-BD', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.changeLanguageBNBD;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(10);
      expect(resp.result.projects[0].author.locale.language).to.be.a.string();
      expect(resp.result.projects[0].author.locale.language).to.equal('bn-BD');
      expect(resp.result.projects[1].author.locale.language).to.be.a.string();
      expect(resp.result.projects[1].author.locale.language).to.equal('bn-BD');
      expect(resp.result.projects[2].author.locale.language).to.be.a.string();
      expect(resp.result.projects[2].author.locale.language).to.not.equal('bn-BD');

      done();
    });
  });

  test('can change language to id-ID', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.changeLanguageIDID;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(10);
      expect(resp.result.projects[0].author.locale.language).to.be.a.string();
      expect(resp.result.projects[0].author.locale.language).to.equal('id-ID');
      expect(resp.result.projects[1].author.locale.language).to.be.a.string();
      expect(resp.result.projects[1].author.locale.language).to.equal('id-ID');
      expect(resp.result.projects[2].author.locale.language).to.be.a.string();
      expect(resp.result.projects[2].author.locale.language).to.equal('id-ID');
      expect(resp.result.projects[3].author.locale.language).to.be.a.string();
      expect(resp.result.projects[3].author.locale.language).to.not.equal('id-ID');
      done();
    });
  });

  test('can change language to lol-rofl', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.changeLanguageLolRofl;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(10);
      expect(resp.result.projects[0].author.locale.language).to.be.a.string();
      expect(resp.result.projects[0].author.locale.language).to.equal('lol-rofl');
      expect(resp.result.projects[1].author.locale.language).to.be.a.string();
      expect(resp.result.projects[1].author.locale.language).to.equal('lol-rofl');
      expect(resp.result.projects[2].author.locale.language).to.be.a.string();
      expect(resp.result.projects[2].author.locale.language).to.equal('lol-rofl');
      expect(resp.result.projects[3].author.locale.language).to.be.a.string();
      expect(resp.result.projects[3].author.locale.language).to.equal('lol-rofl');
      expect(resp.result.projects[4].author.locale.language).to.be.a.string();
      expect(resp.result.projects[4].author.locale.language).to.not.equal('lol-rofl');
      done();
    });
  });

  test('can change count', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.changeCount;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(3);
      done();
    });
  });

  test('can change page', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.changePage;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(3);
      done();
    });
  });

  test('returns 0 results when page out of range', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.success.returnsNoneWhenPageTooHigh;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.projects).to.exist();
      expect(resp.result.projects).to.be.an.array();
      expect(resp.result.projects.length).to.equal(0);
      done();
    });
  });

  test('count can not be negative', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.query.count.negative;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('count can not be greater than 100', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.query.count.tooHigh;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('count can not be non-numeric', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.query.count.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page can not be negative', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.query.page.negative;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page can not be greater than 50', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.query.page.tooHigh;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page can not be non-numeric', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.query.page.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('can\'t change language to nonsense string', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.params.language.changeLanguageNonsense;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('can\'t change language to newline', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.params.language.changeLanguageNewline;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('can\'t change language to number', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.params.language.changeLanguageNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = projectConfigs.get.discoverByLanguage.fail.error;
    var stub = sinon.stub(server.methods.projects, 'findFeaturedByLanguage')
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
