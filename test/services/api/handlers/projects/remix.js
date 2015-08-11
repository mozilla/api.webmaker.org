var configs = require('../../../../fixtures/configs/project-handlers'),
  userFixtures = require('../../../../fixtures/users'),
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

experiment('POST /user/{users}/projects/{project}/remixes', function() {
  before(function(done) {
    // clear remix data cache
    server.methods.cache.invalidateKey('projects', 'findDataForRemix', [1], done);
  });

  test('success', function(done) {
    var opts = configs.create.remix.success.remix;
    var checkRemixProject = configs.create.remix.success.checkRemixProject;
    var checkRemixPages = configs.create.remix.success.checkRemixPages;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('remixed');
      var projectId = resp.result.project.id;
      expect(projectId).to.exist();
      checkRemixProject.url = checkRemixProject.url.replace('$1', projectId);
      checkRemixPages.url = checkRemixPages.url.replace('$1', projectId);
      server.inject(checkRemixProject, function(projectResp) {
        expect(projectResp.statusCode).to.equal(200);
        expect(projectResp.result.project.author.id).to.equal('2');
        expect(projectResp.result.status).to.equal('success');
        expect(projectResp.result.project.id).to.equal(projectId);
        expect(projectResp.result.project.title).to.equal('new');
        expect(projectResp.result.project.remixed_from).to.equal('1');
        server.inject(checkRemixPages, function(pagesResp) {
          expect(pagesResp.statusCode).to.equal(200);
          expect(pagesResp.result.status).to.equal('success');
          expect(pagesResp.result.pages).to.be.an.array();
          expect(pagesResp.result.pages.length).to.equal(3);
          expect(pagesResp.result.pages[0].elements.length).to.equal(7);
          expect(pagesResp.result.pages[1].elements.length).to.equal(7);
          var fixedLink = pagesResp.result.pages[1].elements[2];
          var wasAlreadyBrokenLink = pagesResp.result.pages[1].elements[0];
          var otherFixedLink = pagesResp.result.pages[1].elements[3];
          expect(fixedLink.attributes.targetUserId).to.equal('2');
          expect(fixedLink.attributes.targetProjectId).to.equal(projectId);
          expect(fixedLink.attributes.targetPageId).to.equal('30');
          expect(wasAlreadyBrokenLink.attributes.targetUserId).to.equal('2');
          expect(wasAlreadyBrokenLink.attributes.targetProjectId).to.equal(projectId);
          // original project page deleted/missing, targetPageId was deleted
          expect(wasAlreadyBrokenLink.attributes.targetPageId).to.not.exist();
          expect(otherFixedLink.attributes.targetUserId).to.equal('2');
          expect(otherFixedLink.attributes.targetProjectId).to.equal(projectId);
          expect(otherFixedLink.attributes.targetPageId).to.equal('30');
          done();
        });
      });
    });
  });

  test('can remix project as a new user', function(done) {
    var opts = configs.create.remix.success.newUserFromRemix;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });

  test('404 user not found', function(done) {
    var opts = configs.create.remix.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('invalid user type', function(done) {
    var opts = configs.create.remix.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('404 project not found', function(done) {
    var opts = configs.create.remix.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('invalid project type', function(done) {
    var opts = configs.create.remix.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('handles errors from postgre', function(done) {
    var opts = configs.create.remix.fail.error;
    var stub = sinon.stub(server.methods.projects, 'remix')
      .callsArgWith(2, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.equal('An internal server error occurred');
      stub.restore();
      done();
    });
  });

  test('handles error if findDataForRemix fails', function(done) {
    var opts = configs.create.remix.fail.error;
    var stub = sinon.stub(server.methods.projects, 'findDataForRemix')
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.equal('An internal server error occurred');
      stub.restore();
      done();
    });
  });

  test('handles error if getTokenUserFails', function(done) {
    var opts = configs.create.remix.fail.newUserFromRemix;
    sinon.stub(server.methods.users, 'find')
      .onFirstCall()
      .callsArgWith(1, null, {
        rows: [userFixtures.chris_testing]
      })
      .onSecondCall()
      .callsArgWith(1, mockErr());

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(500);
      expect(resp.result.error).to.equal('Internal Server Error');
      expect(resp.result.message).to.equal('An internal server error occurred');
      server.methods.users.find.restore();
      done();
    });
  });
});
