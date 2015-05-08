var spawn = require('cross-spawn');

var insert = spawn('psql', ['-d', 'webmaker_testing', '-f', 'scripts/test-data.sql']);

insert.stdout.on('data', function(data) {
  console.log( data.toString() );
});

insert.stderr.on('data', function (data) {
  console.log( data.toString() );
});

insert.on('close', function(code) {
  process.exit(code);
});
