var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect,
  routes = require('../../../../services/api/routes');


experiment('pages routes', function() {
  test(
    'applies config to get /users/{user}/projects/{project}/pages',
    function(done) {
      var pages = routes.at('get /users/{user}/projects/{project}/pages');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('get');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(2);
      done();
    }
  );

  test(
    'applies config to get /users/{user}/projects/{project}/pages/{page}',
    function(done) {
      var pages = routes.at('get /users/{user}/projects/{project}/pages/{page}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('get');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(2);
      done();
    }
  );

  test(
    'applies config to post /users/{user}/projects/{project}/pages',
    function(done) {
      var pages = routes.at('post /users/{user}/projects/{project}/pages');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('post');
      expect(pages.config.auth).to.be.an.object();
      expect(pages.config.auth.mode).to.equal('required');
      expect(pages.config.auth.strategies).to.include('token');
      expect(pages.config.auth.scope).to.equal('projects');
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.payload).to.be.an.object();
      expect(pages.config.validate.payload.x).to.be.an.object();
      expect(pages.config.validate.payload.y).to.be.an.object();
      expect(pages.config.validate.payload.styles).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(3);
      done();
    }
  );

  test(
    'applies config to patch /users/{user}/projects/{project}/pages/{page}',
    function(done) {
      var pages = routes.at('patch /users/{user}/projects/{project}/pages/{page}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('patch');
      expect(pages.config.auth).to.be.an.object();
      expect(pages.config.auth.mode).to.equal('required');
      expect(pages.config.auth.strategies).to.include('token');
      expect(pages.config.auth.scope).to.equal('projects');
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      expect(pages.config.validate.payload).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(4);
      done();
    }
  );

  test(
    'applies config to delete /users/{user}/projects/{project}/pages/{page}',
    function(done) {
      var pages = routes.at('delete /users/{user}/projects/{project}/pages/{page}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('delete');
      expect(pages.config.auth).to.be.an.object();
      expect(pages.config.auth.mode).to.equal('required');
      expect(pages.config.auth.strategies).to.include('token');
      expect(pages.config.auth.scope).to.equal('projects');
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(4);
      done();
    }
  );

  test(
    'applies config to options /users/{user}/projects/{project}/pages',
    function(done) {
      var pages = routes.at('options /users/{user}/projects/{project}/pages');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('options');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      done();
    }
  );

  test(
    'applies config to options /users/{user}/projects/{project}/pages/{page}',
    function(done) {
      var pages = routes.at('options /users/{user}/projects/{project}/pages/{page}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('options');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      done();
    }
  );
});
