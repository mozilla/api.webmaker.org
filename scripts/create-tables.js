var spawn = require('cross-spawn');

var create = spawn('psql', ['-d','webmaker_testing', '-f', 'scripts/create-tables.sql']);

create.stdout.on('data', function(data) {
  console.log( data.toString() );
});

create.stderr.on('data', function (data) {
  console.log( data.toString() );
});

create.on('close', function(code) {
  process.exit(code);
});
