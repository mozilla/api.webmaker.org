var requireTree = require('require-tree'),
  path = require('path'),
  elementConfigs = requireTree(path.resolve(__dirname + '../../../../../fixtures/configs/elements')),
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

experiment('DELETE /users/{user}/projects/{project}/pages/{page}/elements/{element}', function() {
  test('success - owner', function(done) {
    var opts = elementConfigs.remove.success.owner;

    server.on('tail', function(request) {
      if ( request.url.path !== opts.url ) {
        return;
      }
      server.removeAllListeners('tail');
      server.inject(
        '/users/2/projects/3/pages/7/elements/8',
        function(resp) {
          expect(resp.statusCode).to.equal(404);
          done();
        }
      );
    });

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('deleted');
    });
  });

  test('success - moderator', function(done) {
    var opts = elementConfigs.remove.success.moderator;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(200);
      expect(resp.result.status).to.equal('deleted');
      server.inject(
        '/users/2/projects/3/pages/7/elements/9',
        function(resp) {
          expect(resp.statusCode).to.equal(404);
          done();
        }
      );
    });
  });

  test('user not found', function(done) {
    var opts = elementConfigs.remove.fail.params.user.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('User not found');
      done();
    });
  });

  test('user not number', function(done) {
    var opts = elementConfigs.remove.fail.params.user.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user not integer', function(done) {
    var opts = elementConfigs.remove.fail.params.user.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('user does not own project', function(done) {
    var opts = elementConfigs.remove.fail.params.user.doesNotOwnProject;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.equal('Insufficient permissions');
      done();
    });
  });

  test('project not found', function(done) {
    var opts = elementConfigs.remove.fail.params.project.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Project not found');
      done();
    });
  });

  test('project not number', function(done) {
    var opts = elementConfigs.remove.fail.params.project.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('project not integer', function(done) {
    var opts = elementConfigs.remove.fail.params.project.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page not found', function(done) {
    var opts = elementConfigs.remove.fail.params.page.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Page not found');
      done();
    });
  });

  test('page not number', function(done) {
    var opts = elementConfigs.remove.fail.params.page.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('page not integer', function(done) {
    var opts = elementConfigs.remove.fail.params.page.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('element not found', function(done) {
    var opts = elementConfigs.remove.fail.params.element.notFound;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(404);
      expect(resp.result.error).to.equal('Not Found');
      expect(resp.result.message).to.equal('Element not found');
      done();
    });
  });

  test('element not number', function(done) {
    var opts = elementConfigs.remove.fail.params.element.notNumber;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('element not integer', function(done) {
    var opts = elementConfigs.remove.fail.params.element.notInteger;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(400);
      expect(resp.result.error).to.equal('Bad Request');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Only the project owner can delete a page\'s elements', function(done) {
    var opts = elementConfigs.remove.fail.auth.notOwner;

    server.inject(opts, function(resp) {
      expect(resp.statusCode).to.equal(403);
      expect(resp.result.error).to.equal('Forbidden');
      expect(resp.result.message).to.be.a.string();
      done();
    });
  });

  test('Handles errors from postgre', function(done) {
    var opts = elementConfigs.remove.fail.error;
    var stub = sinon.stub(server.methods.elements, 'remove')
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
