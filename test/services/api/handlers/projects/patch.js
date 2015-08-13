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

experiment('Patch /users/{user}/projects/{project}', function() {
  test('update title succeeds', function(done) {
    var opts = projectConfigs.patch.update.success.title;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      expect(resp.result.project.title).to.equal('new');
      done();
    });
  });

  test('update with a thumbnail object succeeds, does not update thumbnail', function(done) {
    var opts = projectConfigs.patch.update.success.withThumbnailKey;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('updated');
      expect(resp.result.project.title).to.equal('newww');
      expect(resp.result.project.thumbnail[320]).to.not.equal('will not work');
      done();
    });
  });

  test('invalid user param', function(done) {
    var opts = projectConfigs.patch.update.fail.param.user;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('invalid project param', function(done) {
    var opts = projectConfigs.patch.update.fail.param.project;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('invalid title type', function(done) {
    var opts = projectConfigs.patch.update.fail.payload.title;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });
  test('Title length > 256 characters', function(done) {
      var opts = projectConfigs.patch.update.fail.payload.titleLength;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

  test('cant update another user\'s project', function(done) {
    var opts = projectConfigs.patch.update.fail.auth.wrongUser;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('moderator cant update another user\'s project', function(done) {
    var opts = projectConfigs.patch.update.fail.auth.wrongUser;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = projectConfigs.patch.update.fail.error;
    var stub = sinon.stub(server.methods.projects, 'update')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.equal('An internal server error occurred');
      stub.restore();
      done();
    });
  });

  test('project tail cache error reported', function(done) {
    var opts = projectConfigs.patch.update.fail.error;
    var stub = sinon.stub(server.methods.projects.findOne.cache, 'drop')
      .callsArgWith(1, mockErr());

    server.on('tail', function(request) {
      if ( request.url.path !== opts.url ) {
        return;
      }
      server.removeAllListeners('tail');
      stub.restore();
      done();
    });

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
    });
  });
});
