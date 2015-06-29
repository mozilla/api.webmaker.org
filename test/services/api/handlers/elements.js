var configs = require('../../../fixtures/configs/element-handlers'),
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
  require('../../../mocks/server')(function(obj) {
    server = obj;
    done();
  });
});

after(function(done) {
  server.stop(done);
});

experiment('Element Handlers', function() {
  experiment('prerequisites', function() {
    test('getElement pg error', function(done) {
      var opts = configs.prerequisites.fail;
      var stub = sinon.stub(server.methods.elements, 'findOne')
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

  experiment('Get all elements in a page', function() {
    test('many elements', function(done) {
      var opts = configs.get.all.success.manyElements;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.elements).to.be.an.array();
        expect(resp.result.elements.length).to.equal(7);
        done();
      });
    });

    test('no elements', function(done) {
      var opts = configs.get.all.success.noElements;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.elements).to.be.an.array();
        expect(resp.result.elements.length).to.equal(0);
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

    test('page not found', function(done) {
      var opts = configs.get.all.fail.params.page.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Page not found');
        done();
      });
    });

    test('page not number', function(done) {
      var opts = configs.get.all.fail.params.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not integer', function(done) {
      var opts = configs.get.all.fail.params.page.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.all.fail.error;
      var stub = sinon.stub(server.methods.elements, 'findAll')
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
    test('success', function(done) {
      var opts = configs.get.one.success;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('success');
        expect(resp.result.element).to.be.an.object();
        expect(resp.result.element.id).to.equal('1');
        expect(resp.result.element.page_id).to.equal('1');
        expect(resp.result.element.attributes).to.be.an.object();
        expect(resp.result.element.attributes).to.deep.equal({});
        expect(resp.result.element.styles).to.be.an.object();
        expect(resp.result.element.styles).to.deep.equal({});
        expect(resp.result.element.history).to.be.an.object();
        expect(resp.result.element.history.created_at).to.be.a.date();
        expect(resp.result.element.history.updated_at).to.be.a.date();
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

    test('element not found', function(done) {
      var opts = configs.get.one.fail.params.element.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Element not found');
        done();
      });
    });

    test('element not number', function(done) {
      var opts = configs.get.one.fail.params.element.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('element not integer', function(done) {
      var opts = configs.get.one.fail.params.element.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.get.one.fail.error;
      var stub = sinon.stub(server.methods.elements, 'findOne')
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

  experiment('Create Element', function() {
    test('successfully create element without providing styles or attributes', function(done) {
      var opts = configs.create.success.emptyJSON;
      var created;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        created = resp.result.element.id;
        expect(created).to.exist();
        server.inject(
          '/users/1/projects/7/pages/6/elements/' + created,
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.element).to.exist();
            expect(resp.result.element.type).to.equal('text');
            expect(resp.result.element.attributes).to.be.an.object();
            expect(resp.result.element.attributes).to.deep.equal({});
            expect(resp.result.element.styles).to.be.an.object();
            expect(resp.result.element.styles).to.deep.equal({});
            done();
          }
        );
      });
    });

    test('successfully create element with provided style', function(done) {
      var opts = configs.create.success.withStyle;
      var created;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('created');
        created = resp.result.element.id;
        expect(created).to.exist();
        server.inject(
          '/users/1/projects/7/pages/6/elements/' + created,
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.element).to.exist();
            expect(resp.result.element.type).to.equal('text');
            expect(resp.result.element.attributes).to.be.an.object();
            expect(resp.result.element.attributes).to.deep.equal({});
            expect(resp.result.element.styles).to.be.an.object();
            expect(resp.result.element.styles).to.deep.equal({ color: '#FF0000' });
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

    test('page not found', function(done) {
      var opts = configs.create.fail.params.page.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Page not found');
        done();
      });
    });

    test('page not number', function(done) {
      var opts = configs.create.fail.params.page.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('page not integer', function(done) {
      var opts = configs.create.fail.params.page.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('type not provided', function(done) {
      var opts = configs.create.fail.payload.type.notProvided;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('type not string', function(done) {
      var opts = configs.create.fail.payload.type.notString;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('attributes not object', function(done) {
      var opts = configs.create.fail.payload.attributes.notObject;

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

    test('Handles errors from postgre', function(done) {
      var opts = configs.create.fail.error;
      var stub = sinon.stub(server.methods.elements, 'create')
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

  experiment('Update element', function() {
    test('succeeds with only styles in payload', function(done) {
      var opts = configs.patch.success.onlyStyles;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        server.inject(
          '/users/1/projects/1/pages/1/elements/1',
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.element).to.exist();
            expect(resp.result.element.id).to.equal('1');
            expect(resp.result.element.styles).to.be.an.object();
            expect(resp.result.element.styles).to.deep.equal({ color: '#FF0000' });
            expect(resp.result.element.attributes).to.be.an.object();
            expect(resp.result.element.attributes).to.deep.equal({});
            done();
          }
        );
      });
    });

    test('succeeds with only attributes in payload', function(done) {
      var opts = configs.patch.success.onlyAttributes;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        server.inject(
          '/users/1/projects/1/pages/1/elements/1',
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.element).to.exist();
            expect(resp.result.element.id).to.equal('1');
            expect(resp.result.element.styles).to.be.an.object();
            expect(resp.result.element.styles).to.deep.equal({ color: '#FF0000' });
            expect(resp.result.element.attributes).to.be.an.object();
            expect(resp.result.element.attributes).to.deep.equal({ value: 'hello world' });
            done();
          }
        );
      });
    });

    test('succeeds with attributes and styles in payload', function(done) {
      var opts = configs.patch.success.all;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.status).to.equal('updated');
        server.inject(
          '/users/1/projects/1/pages/1/elements/1',
          function(resp) {
            expect(resp.statusCode).to.equal(200);
            expect(resp.result.element).to.exist();
            expect(resp.result.element.id).to.equal('1');
            expect(resp.result.element.styles).to.be.an.object();
            expect(resp.result.element.styles).to.deep.equal({ color: '#0000FF' });
            expect(resp.result.element.attributes).to.be.an.object();
            expect(resp.result.element.attributes).to.deep.equal({ value: 'world, hello' });
            done();
          }
        );
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

    test('element not found', function(done) {
      var opts = configs.patch.fail.params.element.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Element not found');
        done();
      });
    });

    test('element not number', function(done) {
      var opts = configs.patch.fail.params.element.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('element not integer', function(done) {
      var opts = configs.patch.fail.params.element.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('attributes not object', function(done) {
      var opts = configs.patch.fail.payload.attributes.notObject;

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

    test('missing all payload keys', function(done) {
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
      var stub = sinon.stub(server.methods.elements, 'update')
        .callsArgWith(1, mockErr());

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(500);
        expect(resp.result.error).to.equal('Internal Server Error');
        expect(resp.result.message).to.be.a.string();
        stub.restore();
        done();
      });
    });

    test('element tail cache error reported', function(done) {
      var opts = configs.patch.fail.error;
      var stub = sinon.stub(server.methods.elements.findOne.cache, 'drop')
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

  experiment('Delete Element', function() {
    test('success - owner', function(done) {
      var opts = configs.del.success.owner;

      server.once('tail', function() {
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
      var opts = configs.del.success.moderator;

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
        expect(resp.statusCode).to.equal(403);
        expect(resp.result.error).to.equal('Forbidden');
        expect(resp.result.message).to.equal('Insufficient permissions');
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

    test('element not found', function(done) {
      var opts = configs.del.fail.params.element.notFound;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(404);
        expect(resp.result.error).to.equal('Not Found');
        expect(resp.result.message).to.equal('Element not found');
        done();
      });
    });

    test('element not number', function(done) {
      var opts = configs.del.fail.params.element.notNumber;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('element not integer', function(done) {
      var opts = configs.del.fail.params.element.notInteger;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.error).to.equal('Bad Request');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Only the project owner can delete a page\'s elements', function(done) {
      var opts = configs.del.fail.auth.notOwner;

      server.inject(opts, function(resp) {
        expect(resp.statusCode).to.equal(403);
        expect(resp.result.error).to.equal('Forbidden');
        expect(resp.result.message).to.be.a.string();
        done();
      });
    });

    test('Handles errors from postgre', function(done) {
      var opts = configs.del.fail.error;
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
