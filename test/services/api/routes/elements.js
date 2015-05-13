var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect,
  routes = require('../../../../services/api/routes');


experiment('Element routes', function() {
  test(
    'applies config to get /users/{user}/projects/{project}/pages/{page}/elements',
    function(done) {
      var pages = routes.at('GET /users/{user}/projects/{project}/pages/{page}/elements');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('GET');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(3);
      done();
    }
  );

  test(
    'applies config to get /users/{user}/projects/{project}/pages/{page}/elements/{element}',
    function(done) {
      var pages = routes.at('GET /users/{user}/projects/{project}/pages/{page}/elements/{element}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('GET');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      expect(pages.config.validate.params.element).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(3);
      done();
    }
  );

  test(
    'applies config to post /users/{user}/projects/{project}/pages/{page}/elements',
    function(done) {
      var pages = routes.at('POST /users/{user}/projects/{project}/pages/{page}/elements');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('POST');
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
      expect(pages.config.validate.params.page).to.be.an.object();
      expect(pages.config.validate.payload).to.be.an.object();
      expect(pages.config.validate.payload.type).to.be.an.object();
      expect(pages.config.validate.payload.attributes).to.be.an.object();
      expect(pages.config.validate.payload.styles).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(4);
      done();
    }
  );

  test(
    'applies config to patch /users/{user}/projects/{project}/pages/{page}/elements/{element}',
    function(done) {
      var pages = routes.at('PATCH /users/{user}/projects/{project}/pages/{page}/elements/{element}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('PATCH');
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
      expect(pages.config.validate.params.element).to.be.an.object();
      expect(pages.config.validate.payload).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(5);
      done();
    }
  );

  test(
    'applies config to delete /users/{user}/projects/{project}/pages/{page}/elements/{element}',
    function(done) {
      var pages = routes.at('DELETE /users/{user}/projects/{project}/pages/{page}/elements/{element}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('DELETE');
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
      expect(pages.config.validate.params.element).to.be.an.object();
      expect(pages.config.pre).to.be.an.array();
      expect(pages.config.pre.length).to.equal(5);
      done();
    }
  );

  test(
    'applies config to options /users/{user}/projects/{project}/pages/{page}/elements',
    function(done) {
      var pages = routes.at('OPTIONS /users/{user}/projects/{project}/pages/{page}/elements');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('OPTIONS');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      done();
    }
  );

  test(
    'applies config to options /users/{user}/projects/{project}/pages/{page}/elements/{element}',
    function(done) {
      var pages = routes.at('OPTIONS /users/{user}/projects/{project}/pages/{page}/elements/{element}');
      expect(pages).to.be.an.object();
      expect(pages.method).to.equal('OPTIONS');
      expect(pages.config.auth).to.be.false();
      expect(pages.config.cors).to.be.an.object();
      expect(pages.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
      expect(pages.config.validate).to.be.an.object();
      expect(pages.config.validate.params).to.be.an.object();
      expect(pages.config.validate.params.user).to.be.an.object();
      expect(pages.config.validate.params.project).to.be.an.object();
      expect(pages.config.validate.params.page).to.be.an.object();
      expect(pages.config.validate.params.element).to.be.an.object();
      done();
    }
  );
});
