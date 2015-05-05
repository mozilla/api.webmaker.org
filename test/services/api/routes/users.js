var Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  test = lab.test,
  expect = require('code').expect,
  routes = require('../../../../services/api/routes');

experiment('users routes', function() {
  test('applies config to post /api/users', function(done) {
    var create = routes.at('post /api/users');
    expect(create).to.be.an.object();
    expect(create.method).to.equal('post');
    expect(create.config.auth).to.be.false();
    expect(create.config.cors).to.be.an.object();
    expect(create.config.cors.methods).to.include(['post', 'options']);
    expect(create.config.validate).to.be.an.object();
    expect(create.config.validate.payload).to.be.an.object();
    expect(create.config.validate.payload.username).to.be.an.object();
    expect(create.config.validate.payload.language).to.be.an.object();
    expect(create.config.validate.payload.country).to.be.an.object();
    done();
  });

  test('applies config to options /api/users', function(done) {
    var create = routes.at('options /api/users');
    expect(create).to.be.an.object();
    expect(create.method).to.equal('options');
    expect(create.config.auth).to.be.false();
    expect(create.config.cors).to.be.an.object();
    expect(create.config.cors.methods).to.include(['post', 'options']);
    done();
  });

  test('applies config to docs/css/style.css', function(done) {
    var docStyle = routes.at('get /docs/css/style.css');
    expect(docStyle).to.be.an.object();
    expect(docStyle.method).to.equal('get');
    expect(docStyle.config.auth).to.be.false();
    expect(docStyle.config.cors).to.be.false();
    expect(docStyle.config.plugins.lout).to.be.false();
    expect(docStyle.handler).to.be.an.object();
    expect(docStyle.handler.file).to.be.a.string();
    done();
  });

  test('applies config to /', function(done) {
    var root = routes.at('get /');
    expect(root).to.be.an.object();
    expect(root.method).to.equal('get');
    expect(root.handler).to.be.a.function();
    expect(root.config.cors).to.be.false();
    expect(root.config.plugins.lout).to.be.false();
    done();
  });

  test('applies config to get /api/users/{user}', function(done) {
    var users = routes.at('get /api/users/{user}');
    expect(users).to.be.an.object();
    expect(users.method).to.equal('get');
    expect(users.config.auth).to.be.an.object();
    expect(users.config.auth.mode).to.equal('required');
    expect(users.config.auth.strategies).to.include('token');
    expect(users.config.auth.scope).to.equal('user');
    expect(users.config.validate).to.be.an.object();
    expect(users.config.validate.params).to.be.an.object();
    expect(users.config.validate.params.user).to.be.an.object();
    expect(users.config.cors).to.be.an.object();
    expect(users.config.cors.methods).to.include(['options', 'get', 'patch', 'delete']);
    done();
  });

  test('applies config to delete /api/users/{user}', function(done) {
    var users = routes.at('delete /api/users/{user}');
    expect(users).to.be.an.object();
    expect(users.method).to.equal('delete');
    expect(users.config.auth).to.be.an.object();
    expect(users.config.auth.mode).to.equal('required');
    expect(users.config.auth.strategies).to.include('token');
    expect(users.config.auth.scope).to.equal('user');
    expect(users.config.validate).to.be.an.object();
    expect(users.config.validate.params).to.be.an.object();
    expect(users.config.validate.params.user).to.be.an.object();
    expect(users.config.cors).to.be.an.object();
    expect(users.config.cors.methods).to.include(['options', 'get', 'patch', 'delete']);
    done();
  });

  test('applies config to options /api/users/{user}', function(done) {
    var users = routes.at('options /api/users/{user}');
    expect(users).to.be.an.object();
    expect(users.method).to.equal('options');
    expect(users.config.auth).to.be.an.object();
    expect(users.config.auth.mode).to.equal('required');
    expect(users.config.auth.strategies).to.include('token');
    expect(users.config.auth.scope).to.equal('user');
    expect(users.config.cors).to.be.an.object();
    expect(users.config.cors.methods).to.include(['options', 'get', 'patch', 'delete']);
    done();
  });

  test('applies config to patch /api/users/{user}', function(done) {
    var users = routes.at('patch /api/users/{user}');
    expect(users).to.be.an.object();
    expect(users.method).to.equal('patch');
    expect(users.config.auth).to.be.an.object();
    expect(users.config.auth.mode).to.equal('required');
    expect(users.config.auth.strategies).to.include('token');
    expect(users.config.auth.scope).to.equal('user');
    expect(users.config.validate).to.be.an.object();
    expect(users.config.validate.params).to.be.an.object();
    expect(users.config.validate.params.user).to.be.an.object();
    expect(users.config.validate.payload).to.be.an.object();
    expect(users.config.validate.payload.username).to.be.an.object();
    expect(users.config.validate.payload.language).to.be.an.object();
    expect(users.config.validate.payload.country).to.be.an.object();
    expect(users.config.cors).to.be.an.object();
    expect(users.config.cors.methods).to.include(['options', 'get', 'patch', 'delete']);
    done();
  });
});
