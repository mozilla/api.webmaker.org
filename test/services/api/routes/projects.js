var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect,
  routes = require('../../../../services/api/routes');

experiment('project routes', function() {
  test('applies config to get /discover', function(done) {
    var discover = routes.at('get /discover');
    expect(discover).to.be.an.object();
    expect(discover.method).to.equal('get');
    expect(discover.config.auth).to.be.false();
    expect(discover.config.cors).to.be.an.object();
    expect(discover.config.cors.methods).to.include(['get', 'options']);
    expect(discover.config.validate).to.be.an.object();
    expect(discover.config.validate.query).to.be.an.object();
    expect(discover.config.validate.query.count).to.be.an.object();
    expect(discover.config.validate.query.page).to.be.an.object();
    done();
  });

  test('applies config to get /projects', function(done) {
    var projects = routes.at('get /projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('get');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.query).to.be.an.object();
    expect(projects.config.validate.query.count).to.be.an.object();
    expect(projects.config.validate.query.page).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(1);
    done();
  });

  test('applies config to get /users/{user}/projects', function(done) {
    var projects = routes.at('get /users/{user}/projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('get');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'post', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.validate.query).to.be.an.object();
    expect(projects.config.validate.query.count).to.be.an.object();
    expect(projects.config.validate.query.page).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(2);
    done();
  });

  test('applies config to get /users/{user}/projects/{project}', function(done) {
    var projects = routes.at('get /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('get');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'patch', 'options', 'delete']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(1);
    done();
  });

  test('applies config to get /users/{user}/projects/{project}/remixes', function(done) {
    var projects = routes.at('get /users/{user}/projects/{project}/remixes');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('get');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'post', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.query).to.be.an.object();
    expect(projects.config.validate.query.count).to.be.an.object();
    expect(projects.config.validate.query.page).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(3);
    done();
  });

  test('applies config to post /users/{user}/projects', function(done) {
    var projects = routes.at('post /users/{user}/projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('post');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'post', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.payload).to.be.an.object();
    expect(projects.config.validate.payload.title).to.be.an.object();
    expect(projects.config.validate.payload.remixed_from).to.be.an.object();
    expect(projects.config.validate.payload.thumbnail).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(2);
    done();
  });

  test('applies config to patch /users/{user}/projects/{project}', function(done) {
    var projects = routes.at('patch /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('patch');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'patch', 'delete', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.payload).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.validate.payload.title).to.be.an.object();
    expect(projects.config.validate.payload.thumbnail).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(3);
    done();
  });

  test('applies config to delete /users/{user}/projects/{project}', function(done) {
    var projects = routes.at('delete /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('delete');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'patch', 'delete', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(3);
    done();
  });

  test('applies config to post /users/{user}/projects/{project}/remixes', function(done) {
    var projects = routes.at('post /users/{user}/projects/{project}/remixes');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('post');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'post', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(2);
    done();
  });

  test('applies config to patch /users/{user}/projects/{project}/feature', function(done) {
    var projects = routes.at('patch /users/{user}/projects/{project}/feature');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('patch');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['post', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(3);
    done();
  });

  test('applies config to options /users/{user}/projects/{project}/feature', function(done) {
    var projects = routes.at('options /users/{user}/projects/{project}/feature');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('options');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['post', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    done();
  });

  test('applies config to options /discover', function(done) {
    var projects = routes.at('options /discover');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('options');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'options']);
    done();
  });

  test('applies config to options /projects', function(done) {
    var projects = routes.at('options /projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('options');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'options']);
    done();
  });

  test('applies config to options /users/{user}/projects/{project}', function(done) {
    var projects = routes.at('options /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('options');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'patch', 'delete', 'options']);
    done();
  });

  test('applies config to options /users/{user}/projects/{project}/remixes', function(done) {
    var projects = routes.at('options /users/{user}/projects/{project}/remixes');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('options');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['get', 'post', 'options']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    done();
  });
});
