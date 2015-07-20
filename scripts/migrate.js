// pass the path to the env file to load when invoking the script
// i.e. `npm run migrate -- tests.env`
require('habitat').load(process.argv[2]);

var url = require('url');
var Hoek = require('hoek');
var spawn = require('cross-spawn');
var BPromise = require('bluebird');
var fs = BPromise.promisifyAll(require('fs'));
var path = require('path');

var defaults = {
  // default account has no password. Except on Windows, where it asks for a password during installation
  POSTGRE_CONNECTION_STRING: 'postgre://postgres@localhost:5432/webmaker'
};

process.env = Hoek.applyToDefaults(defaults, process.env);

var pgConnString = url.parse(process.env.POSTGRE_CONNECTION_STRING);
Hoek.assert(pgConnString.auth, 'Your PosgreSQL connection string must at least contain a username');
Hoek.assert(pgConnString.hostname, 'Your PosgreSQL connection string must specify a hostname');
Hoek.assert(pgConnString.port, 'Your PosgreSQL connection string must specify a port');
Hoek.assert(pgConnString.port, 'Your PosgreSQL connection string must specify a database');

var pgAuth = pgConnString.auth.split(':');
process.env.PGPASSWORD = pgAuth[1];

fs.readdirAsync('./migrations').each(function(filename) {
  return new BPromise(function(resolve, reject) {
    var create = spawn(
      'psql',
      [
        '-h', pgConnString.hostname,
        '-p', pgConnString.port,
        '-d', pgConnString.path.replace('/', ''),
        '-U', pgAuth[0],
        '-f', path.join( './migrations', filename)], {
      stdio: 'inherit',
      env: process.env
    });

    create.on('close', function(code) {
      if ( code !== 0 ) {
        return reject();
      }
      resolve();
    });

    create.on('error', reject);
  });
}, {
  concurrency: 1
})
.then(function() {
  process.exit(0);
})
.catch(function(err) {
  console.error(err);
  process.exit(1);
});

