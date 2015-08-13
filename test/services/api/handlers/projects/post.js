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

experiment('POST /users/{user}/projects', function() {
  test('success, no thumbnail', function(done) {
    var opts = projectConfigs.post.new.success.withoutThumbnail;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      expect(resp.result.project.id).to.exist();
      expect(resp.result.project.title).to.equal('create_test');
      expect(resp.result.project.version).to.equal('test');
      expect(resp.result.project.remixed_from).to.be.null();
      expect(resp.result.project.featured).to.be.false();
      expect(resp.result.project.history).to.exist();
      expect(resp.result.project.history).to.include(['created_at', 'updated_at']);
      expect(resp.result.project.thumbnail).to.be.an.object();
      expect(resp.result.project.thumbnail).to.not.include(['400', '1024']);
      expect(resp.result.page.id).to.exist();
      expect(resp.result.page.project_id).to.equal(resp.result.project.id);
      expect(resp.result.page.x).to.equal(0);
      expect(resp.result.page.y).to.equal(0);
      done();
    });
  });

  test('success, with thumbnail', function(done) {
    var opts = projectConfigs.post.new.success.withThumbnail;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      expect(resp.result.project.id).to.exist();
      done();
    });
  });

  test('Creates new user from token', function(done) {
    var opts = projectConfigs.post.new.success.userFromToken;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('created');
      expect(resp.result.project.id).to.exist();
      done();
    });
  });

  test('invalid title type', function(done) {
    var opts = projectConfigs.post.new.fail.payload.title;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('invalid thumbnail type', function(done) {
    var opts = projectConfigs.post.new.fail.payload.thumb;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('invalid thumbnail key value', function(done) {
    var opts = projectConfigs.post.new.fail.payload.thumbValue;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('invalid thumbnail key name', function(done) {
    var opts = projectConfigs.post.new.fail.payload.thumbKey;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Title length > 256 characters', function(done) {
    var opts = projectConfigs.post.new.fail.payload.titleLength;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('404 user not found', function(done) {
    var opts = projectConfigs.post.new.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('invalid user type', function(done) {
    var opts = projectConfigs.post.new.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('cant create for different user', function(done) {
    var opts = projectConfigs.post.new.fail.auth.wrongUser;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('new user from token - handles errors from postgre', function(done) {
    var opts = projectConfigs.post.new.fail.auth.userFromToken;
    var stub = sinon.stub(server.methods.users, 'create')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.be.a.string();
      stub.restore();
      done();
    });
  });

  test('handles errors from postgre', function(done) {
    var opts = projectConfigs.post.new.fail.error;
    var stub = sinon.stub(server.methods.projects, 'create')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.be.a.string();
      stub.restore();
      done();
    });
  });
});
