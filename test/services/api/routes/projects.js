var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect,
  routes = require('../../../../services/api/routes');

experiment('project routes', function() {
  test('applies config to get /discover', function(done) {
    var discover = routes.at('GET /discover');
    expect(discover).to.be.an.object();
    expect(discover.method).to.equal('GET');
    expect(discover.config.auth).to.be.false();
    expect(discover.config.cors).to.be.an.object();
    expect(discover.config.cors.methods).to.include(['GET', 'OPTIONS']);
    expect(discover.config.validate).to.be.an.object();
    expect(discover.config.validate.query).to.be.an.object();
    expect(discover.config.validate.query.count).to.be.an.object();
    expect(discover.config.validate.query.page).to.be.an.object();
    done();
  });

  test('applies config to get /projects', function(done) {
    var projects = routes.at('GET /projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('GET');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'OPTIONS']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.query).to.be.an.object();
    expect(projects.config.validate.query.count).to.be.an.object();
    expect(projects.config.validate.query.page).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(1);
    done();
  });

  test('applies config to get /users/{user}/projects', function(done) {
    var projects = routes.at('GET /users/{user}/projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('GET');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
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
    var projects = routes.at('GET /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('GET');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'PATCH', 'OPTIONS', 'DELETE']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(1);
    done();
  });

  test('applies config to get /users/{user}/projects/{project}/remixes', function(done) {
    var projects = routes.at('GET /users/{user}/projects/{project}/remixes');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('GET');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
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
    var projects = routes.at('POST /users/{user}/projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('POST');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
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
    var projects = routes.at('PATCH /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('PATCH');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
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
    var projects = routes.at('DELETE /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('DELETE');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(3);
    done();
  });

  test('applies config to post /users/{user}/projects/{project}/remixes', function(done) {
    var projects = routes.at('POST /users/{user}/projects/{project}/remixes');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('POST');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(2);
    done();
  });

  test('applies config to patch /users/{user}/projects/{project}/feature', function(done) {
    var projects = routes.at('PATCH /users/{user}/projects/{project}/feature');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('PATCH');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['POST', 'OPTIONS']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    expect(projects.config.pre).to.be.an.array();
    expect(projects.config.pre.length).to.equal(3);
    done();
  });

  test('applies config to options /users/{user}/projects/{project}/feature', function(done) {
    var projects = routes.at('OPTIONS /users/{user}/projects/{project}/feature');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('OPTIONS');
    expect(projects.config.auth).to.be.an.object();
    expect(projects.config.auth.mode).to.equal('required');
    expect(projects.config.auth.strategies).to.include('token');
    expect(projects.config.auth.scope).to.equal('projects');
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['POST', 'OPTIONS']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    done();
  });

  test('applies config to options /discover', function(done) {
    var projects = routes.at('OPTIONS /discover');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('OPTIONS');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'OPTIONS']);
    done();
  });

  test('applies config to options /projects', function(done) {
    var projects = routes.at('OPTIONS /projects');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('OPTIONS');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'OPTIONS']);
    done();
  });

  test('applies config to options /users/{user}/projects/{project}', function(done) {
    var projects = routes.at('OPTIONS /users/{user}/projects/{project}');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('OPTIONS');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'PATCH', 'DELETE', 'OPTIONS']);
    done();
  });

  test('applies config to options /users/{user}/projects/{project}/remixes', function(done) {
    var projects = routes.at('OPTIONS /users/{user}/projects/{project}/remixes');
    expect(projects).to.be.an.object();
    expect(projects.method).to.equal('OPTIONS');
    expect(projects.config.auth).to.be.false();
    expect(projects.config.cors).to.be.an.object();
    expect(projects.config.cors.methods).to.include(['GET', 'POST', 'OPTIONS']);
    expect(projects.config.validate).to.be.an.object();
    expect(projects.config.validate.params).to.be.an.object();
    expect(projects.config.validate.params.project).to.be.an.object();
    expect(projects.config.validate.params.user).to.be.an.object();
    done();
  });
});
