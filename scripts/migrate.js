var spawn = require('cross-spawn');
var BPromise = require('bluebird');
var fs = BPromise.promisifyAll(require('fs'));
var path = require('path');

var db = process.argv[2] || 'webmaker_testing';
console.log( __dirname );
fs.readdirAsync('./migrations').each(function(filename) {
  return new BPromise(function(resolve, reject) {
    var create = spawn('psql', ['-d', db, '-f', path.join( './migrations', filename)], {
      stdio: 'inherit'
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

