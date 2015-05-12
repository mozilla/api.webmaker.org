var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server;

before(function(done) {
  require('../../../mocks/server')(function(obj) {
    server = obj;
    done();
  }, { enableCache: true });
});

after(function(done) {
  server.stop(done);
});

experiment('Server Methods', function() {
  experiment('Has Cache config', function() {
    test('projects.findAll should have cache config', function(done) {
      expect(server.methods.projects.findAll).to.be.a.function();
      expect(server.methods.projects.findAll.cache).to.be.an.object();
      done();
    });

    test('projects.findUsersProjects should have cache config', function(done) {
      expect(server.methods.projects.findUsersProjects).to.be.a.function();
      expect(server.methods.projects.findUsersProjects.cache).to.be.an.object();
      done();
    });

    test('projects.findOne should have cache config', function(done) {
      expect(server.methods.projects.findOne).to.be.a.function();
      expect(server.methods.projects.findOne.cache).to.be.an.object();
      done();
    });

    test('projects.findRemixes should have cache config', function(done) {
      expect(server.methods.projects.findRemixes).to.be.a.function();
      expect(server.methods.projects.findRemixes.cache).to.be.an.object();
      done();
    });

    test('projects.findFeatured should have cache config', function(done) {
      expect(server.methods.projects.findFeatured).to.be.a.function();
      expect(server.methods.projects.findFeatured.cache).to.be.an.object();
      done();
    });

    test('pages.findAll should have cache config', function(done) {
      expect(server.methods.pages.findAll).to.be.a.function();
      expect(server.methods.pages.findAll.cache).to.be.an.object();
      done();
    });

    test('pages.findOne should have cache config', function(done) {
      expect(server.methods.pages.findOne).to.be.a.function();
      expect(server.methods.pages.findOne.cache).to.be.an.object();
      done();
    });

    test('elements.findAll should have cache config', function(done) {
      expect(server.methods.elements.findAll).to.be.a.function();
      expect(server.methods.elements.findAll.cache).to.be.an.object();
      done();
    });

    test('elements.findOne should have cache config', function(done) {
      expect(server.methods.elements.findOne).to.be.a.function();
      expect(server.methods.elements.findOne.cache).to.be.an.object();
      done();
    });
  });

  experiment('Has no caching', function() {
    test('users.find should not have cache config', function(done) {
      expect(server.methods.users.find).to.be.a.function();
      expect(server.methods.users.find.cache).to.be.undefined();
      done();
    });

    test('users.create should not have cache config', function(done) {
      expect(server.methods.users.create).to.be.a.function();
      expect(server.methods.users.create.cache).to.be.undefined();
      done();
    });

    test('users.update should not have cache config', function(done) {
      expect(server.methods.users.update).to.be.a.function();
      expect(server.methods.users.update.cache).to.be.undefined();
      done();
    });

    test('users.remove should not have cache config', function(done) {
      expect(server.methods.users.remove).to.be.a.function();
      expect(server.methods.users.remove.cache).to.be.undefined();
      done();
    });

    test('projects.create should not have cache config', function(done) {
      expect(server.methods.projects.create).to.be.a.function();
      expect(server.methods.projects.create.cache).to.be.undefined();
      done();
    });

    test('projects.update should not have cache config', function(done) {
      expect(server.methods.projects.update).to.be.a.function();
      expect(server.methods.projects.update.cache).to.be.undefined();
      done();
    });

    test('projects.remove should not have cache config', function(done) {
      expect(server.methods.projects.remove).to.be.a.function();
      expect(server.methods.projects.remove.cache).to.be.undefined();
      done();
    });

    test('pages.create should not have cache config', function(done) {
      expect(server.methods.pages.create).to.be.a.function();
      expect(server.methods.pages.create.cache).to.be.undefined();
      done();
    });

    test('pages.update should not have cache config', function(done) {
      expect(server.methods.pages.update).to.be.a.function();
      expect(server.methods.pages.update.cache).to.be.undefined();
      done();
    });

    test('pages.remove should not have cache config', function(done) {
      expect(server.methods.pages.remove).to.be.a.function();
      expect(server.methods.pages.remove.cache).to.be.undefined();
      done();
    });

    test('elements.create should not have cache config', function(done) {
      expect(server.methods.elements.create).to.be.a.function();
      expect(server.methods.elements.create.cache).to.be.undefined();
      done();
    });

    test('elements.update should not have cache config', function(done) {
      expect(server.methods.elements.update).to.be.a.function();
      expect(server.methods.elements.update.cache).to.be.undefined();
      done();
    });

    test('elements.remove should not have cache config', function(done) {
      expect(server.methods.elements.remove).to.be.a.function();
      expect(server.methods.elements.remove.cache).to.be.undefined();
      done();
    });
  });

  experiment('generateKeys', function() {
    test('executes', function(done) {
      server.methods.projects.findOne([7, 1], function(err, result) {
        expect(err).to.be.null();
        server.methods.projects.update(['blah','{}', 7], function(err) {
          expect(err).to.be.null();
          server.methods.projects.findOne([7, 1], function(err, result) {
            expect(err).to.be.null();
            expect(result.rows.length).to.equal(1);
            expect(result.rows[0].title).to.equal('test_project_7');
            expect(result.rows[0].thumbnail).to.deep.equal({});
            done();
          });
        });
      });
    });
  });
});
