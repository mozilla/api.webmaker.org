var configs = require('../../../fixtures/configs/page-handlers'),
  sinon = require('sinon'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server,
  thumnailServiceUrl;

function mockErr() {
  var e = new Error('relation does not exist');
  e.name = 'error';
  e.severity = 'ERROR';
  e.code = '42P01';
  return e;
}

before(function(done) {
  thumnailServiceUrl = process.env.THUMBNAIL_SERVICE_URL;
  delete process.env.THUMBNAIL_SERVICE_URL;
  require('../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  process.env.THUMBNAIL_SERVICE_URL = thumnailServiceUrl;
  server.stop(done);
});

experiment('Page Handlers', function() {
  experiment('prerequisites', function() {
    test('getPage pg error', function(done) {
      var opts = configs.prerequisites.fail;
      var stub = sinon.stub(server.methods.pages, 'findOne')
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

  experiment('Get all pages in project', function() {
    test('many pages', function(done) {
      var opts = configs.get.all.success.manyPages;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.pages).to.be.an.array();
        expect(resp.result.pages.length).to.equal(5);
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

  experiment('Get single page', function() {
    test('that has many elements', function(done) {
      var opts = configs.get.one.success.pageWithElements;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.page).to.be.an.object();
        expect(resp.result.page.id).to.equal('1');
        expect(resp.result.page.project_id).to.equal('1');
        expect(resp.result.page.x).to.equal(0);
        expect(resp.result.page.y).to.equal(0);
        expect(resp.result.page.styles).to.be.an.object();
        expect(resp.result.page.elements).to.be.an.array();
        expect(resp.result.page.elements.length).to.equal(7);
        done();
      });
    });

    test('a page with no elements', function(done) {
      var opts = configs.get.one.success.pageWithoutElements;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.page).to.be.an.object();
        expect(resp.result.page.id).to.equal('2');
        expect(resp.result.page.project_id).to.equal('1');
        expect(resp.result.page.x).to.equal(0);
        expect(resp.result.page.y).to.equal(1);
        expect(resp.result.page.styles).to.deep.equal({});
        expect(resp.result.page.elements).to.be.an.array();
        expect(resp.result.page.elements.length).to.equal(0);
        done();
      });
    });

    test('user not found', function(done) {
      var opts = configs.get.one.fail.params.user.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('user not number', function(done) {
      var opts = configs.get.one.fail.params.user.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user not integer', function(done) {
      var opts = configs.get.one.fail.params.user.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user does not own project', function(done) {
      var opts = configs.get.one.fail.params.user.doesNotOwnProject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not found', function(done) {
      var opts = configs.get.one.fail.params.project.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Project not found');
        done();
      });
    });

    test('project not number', function(done) {
      var opts = configs.get.one.fail.params.project.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not integer', function(done) {
      var opts = configs.get.one.fail.params.project.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page is not part of project', function(done) {
      var opts = configs.get.one.fail.params.project.pageNotInProject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not found', function(done) {
      var opts = configs.get.one.fail.params.page.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Page not found');
        done();
      });
    });

    test('page not number', function(done) {
      var opts = configs.get.one.fail.params.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not integer', function(done) {
      var opts = configs.get.one.fail.params.page.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.one.fail.error;
      var stub = sinon.stub(server.methods.pages, 'findOne')
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

  experiment('Create Page', function() {
    test('successfully create page without providing styles param', function(done) {
      var opts = configs.create.success.emptyStyles;
      var created;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        created = resp.result.page.id;
        expect(created).to.exist();
        server.inject(
          '/users/1/projects/2/pages/' + created,
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal(created);
            expect(resp.result.page.x).to.equal(0);
            expect(resp.result.page.y).to.equal(0);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({});
            done();
          }
        );
      });
    });

    test('successfully create page with a styles object', function(done) {
      var opts = configs.create.success.withStyle;
      var created;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        created = resp.result.page.id;
        expect(created).to.exist();
        server.inject(
          '/users/1/projects/2/pages/' + created,
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal(created);
            expect(resp.result.page.x).to.equal(0);
            expect(resp.result.page.y).to.equal(1);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({ color: '#FF0000' });
            done();
          }
        );
      });
    });

    test('successfully create page with negative x & y', function(done) {
      var opts = configs.create.success.negativeXY;
      var created;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        created = resp.result.page.id;
        expect(created).to.exist();
        server.inject(
          '/users/1/projects/2/pages/' + created,
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal(created);
            expect(resp.result.page.x).to.equal(-1);
            expect(resp.result.page.y).to.equal(-1);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({});
            done();
          }
        );
      });
    });

    test('successfully create page with an x & y position that was deleted', function(done) {
      var opts = configs.create.success.deletedXY;
      var created;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        created = resp.result.page.id;
        expect(created).to.exist();
        server.inject(
          '/users/1/projects/2/pages/' + created,
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal(created);
            expect(resp.result.page.x).to.equal(10);
            expect(resp.result.page.y).to.equal(10);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({});
            done();
          }
        );
      });
    });

    test('user not found', function(done) {
      var opts = configs.create.fail.params.user.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('user not number', function(done) {
      var opts = configs.create.fail.params.user.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user not integer', function(done) {
      var opts = configs.create.fail.params.user.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user does not own project', function(done) {
      var opts = configs.create.fail.params.user.doesNotOwnProject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not found', function(done) {
      var opts = configs.create.fail.params.project.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Project not found');
        done();
      });
    });

    test('project not number', function(done) {
      var opts = configs.create.fail.params.project.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not integer', function(done) {
      var opts = configs.create.fail.params.project.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('x not provided', function(done) {
      var opts = configs.create.fail.payload.x.notProvided;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('x not number', function(done) {
      var opts = configs.create.fail.payload.x.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('x not integer', function(done) {
      var opts = configs.create.fail.payload.x.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('y not provided', function(done) {
      var opts = configs.create.fail.payload.y.notProvided;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('y not number', function(done) {
      var opts = configs.create.fail.payload.y.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('y not integer', function(done) {
      var opts = configs.create.fail.payload.y.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('can not add a page into a project that has the same coord as another page in the project', function(done) {
      var opts = configs.create.fail.payload.xy.duplicateCoords;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('styles not object', function(done) {
      var opts = configs.create.fail.payload.styles.notObject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('can not create page in another user\'s project', function(done) {
      var opts = configs.create.fail.auth.wrongUser;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(403);
        expect(resp.result.error).to.equal('Forbidden');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.create.fail.error;
      var stub = sinon.stub(server.methods.pages, 'create')
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

  experiment('Update page', function() {
    test('succeeds with only x in payload', function(done) {
      var opts = configs.patch.success.onlyX;

      server.once('tail', function() {
        server.inject(
          '/users/1/projects/1/pages/1',
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal('1');
            expect(resp.result.page.x).to.equal(12);
            expect(resp.result.page.y).to.equal(0);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({});
            done();
          }
        );
      });

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
      });
    });

    test('succeeds with only y in payload', function(done) {
      var opts = configs.patch.success.onlyY;

      server.once('tail', function() {
        server.inject(
          '/users/1/projects/1/pages/1',
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal('1');
            expect(resp.result.page.x).to.equal(12);
            expect(resp.result.page.y).to.equal(12);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({});
            done();
          }
        );
      });

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
      });
    });

    test('succeeds with only styles in payload', function(done) {
      var opts = configs.patch.success.onlyStyles;

      server.once('tail', function() {
        server.inject(
          '/users/1/projects/1/pages/1',
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal('1');
            expect(resp.result.page.x).to.equal(12);
            expect(resp.result.page.y).to.equal(12);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({
              color: '#00FF00'
            });
            done();
          }
        );
      });

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
      });
    });

    test('succeeds with all payload params', function(done) {
      var opts = configs.patch.success.all;

      server.once('tail', function() {
        server.inject(
          '/users/1/projects/1/pages/1',
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.page).to.exist();
            expect(resp.result.page.id).to.equal('1');
            expect(resp.result.page.x).to.equal(10);
            expect(resp.result.page.y).to.equal(10);
            expect(resp.result.page.styles).to.be.an.object();
            expect(resp.result.page.styles).to.deep.equal({
              color: '#0000FF'
            });
            done();
          }
        );
      });

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
      });
    });

    test('user not found', function(done) {
      var opts = configs.patch.fail.params.user.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('user not number', function(done) {
      var opts = configs.patch.fail.params.user.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user not integer', function(done) {
      var opts = configs.patch.fail.params.user.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user does not own project', function(done) {
      var opts = configs.patch.fail.params.user.doesNotOwnProject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not found', function(done) {
      var opts = configs.patch.fail.params.project.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Project not found');
        done();
      });
    });

    test('project not number', function(done) {
      var opts = configs.patch.fail.params.project.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not integer', function(done) {
      var opts = configs.patch.fail.params.project.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not found', function(done) {
      var opts = configs.patch.fail.params.page.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Page not found');
        done();
      });
    });

    test('page not number', function(done) {
      var opts = configs.patch.fail.params.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not integer', function(done) {
      var opts = configs.patch.fail.params.page.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page is not part of project', function(done) {
      var opts = configs.patch.fail.params.project.pageNotInProject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('x not number', function(done) {
      var opts = configs.patch.fail.payload.x.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('x not integer', function(done) {
      var opts = configs.patch.fail.payload.x.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('y not number', function(done) {
      var opts = configs.patch.fail.payload.y.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('y not integer', function(done) {
      var opts = configs.patch.fail.payload.y.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('can not update a page with existing coords', function(done) {
      var opts = configs.patch.fail.payload.xy.duplicateCoords;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('styles not object', function(done) {
      var opts = configs.patch.fail.payload.styles.notObject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('missing all', function(done) {
      var opts = configs.patch.fail.payload.missingAll;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.patch.fail.error;
      var stub = sinon.stub(server.methods.pages, 'update')
        .callsArgWith(1, mockErr());

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.be.a.string();
        stub.restore();
        done();
      });
    });

    test('pages tail cache error reported', function(done) {
      var opts = configs.patch.fail.error;
      var stub = sinon.stub(server.methods.pages.findOne.cache, 'drop')
        .callsArgWith(1, mockErr());

      server.once('tail', function() {
        stub.restore();
        done();
      });

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });
    });
  });

  experiment('Delete page', function() {
    test('success - owner', function(done) {
      var opts = configs.del.success.owner;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('deleted');
        server.inject(
          '/users/1/projects/1/pages/1',
          function(resp) {
            expect(resp.statusCode).to.equal(404);
            done();
          }
        );
      });
    });

    test('success - moderator', function(done) {
      var opts = configs.del.success.moderator;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('deleted');
        server.inject(
          '/users/1/projects/1/pages/2',
          function(resp) {
            expect(resp.statusCode).to.equal(404);
            done();
          }
        );
      });
    });

    test('user not found', function(done) {
      var opts = configs.del.fail.params.user.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('User not found');
        done();
      });
    });

    test('user not number', function(done) {
      var opts = configs.del.fail.params.user.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user not integer', function(done) {
      var opts = configs.del.fail.params.user.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('user does not own project', function(done) {
      var opts = configs.del.fail.params.user.doesNotOwnProject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not found', function(done) {
      var opts = configs.del.fail.params.project.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Project not found');
        done();
      });
    });

    test('project not number', function(done) {
      var opts = configs.del.fail.params.project.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('project not integer', function(done) {
      var opts = configs.del.fail.params.project.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page is not part of project', function(done) {
      var opts = configs.del.fail.params.project.pageNotInProject;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not found', function(done) {
      var opts = configs.del.fail.params.page.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Page not found');
        done();
      });
    });

    test('page not number', function(done) {
      var opts = configs.del.fail.params.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not integer', function(done) {
      var opts = configs.del.fail.params.page.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.del.fail.error;
      var stub = sinon.stub(server.methods.pages, 'remove')
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

  experiment('options', function() {
    test('responds to options requests', function(done) {
      var opts = configs.options.success;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        done();
      });
    });
  });
});
