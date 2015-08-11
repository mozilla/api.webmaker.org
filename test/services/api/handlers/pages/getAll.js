var configs = require('../../../../fixtures/configs/page-handlers'),
  sinon = require('sinon'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server,
  thumbnailServiceUrl;

function mockErr() {
  var e = new Error('relation does not exist');
  e.name = 'error';
  e.severity = 'ERROR';
  e.code = '42P01';
  return e;
}

before(function(done) {
  thumbnailServiceUrl = process.env.THUMBNAIL_SERVICE_URL;
  delete process.env.THUMBNAIL_SERVICE_URL;
  require('../../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  process.env.THUMBNAIL_SERVICE_URL = thumbnailServiceUrl;
  server.stop(done);
});

experiment('GET /users/{user}/projects/{project}/pages', function() {
  test('Get all pages in a project', function(done) {
    var opts = configs.get.all.success.manyPages;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.pages).to.be.an.array();
      expect(resp.result.pages.length).to.equal(3);
      done();
    });
  });

  test('no pages', function(done) {
    var opts = configs.get.all.success.noPages;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('success');
      expect(resp.result.pages).to.be.an.array();
      expect(resp.result.pages.length).to.equal(0);
      done();
    });
  });

  test('user not found', function(done) {
    var opts = configs.get.all.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('user not number', function(done) {
    var opts = configs.get.all.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user not integer', function(done) {
    var opts = configs.get.all.fail.params.user.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user does not own project', function(done) {
    var opts = configs.get.all.fail.params.user.doesNotOwnProject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not found', function(done) {
    var opts = configs.get.all.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('project not number', function(done) {
    var opts = configs.get.all.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not integer', function(done) {
    var opts = configs.get.all.fail.params.project.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = configs.get.all.fail.error;
    var stub = sinon.stub(server.methods.pages, 'findAll')
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
