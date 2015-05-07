var spawn = require('cross-spawn');

var drop = spawn('psql', ['-d', 'webmaker_testing', '-f', 'scripts/drop-tables.sql']);

drop.stdout.on('data', function(data) {
  console.log( data.toString() );
});

drop.stderr.on('data', function (data) {
  console.log( data.toString() );
});

drop.on('close', function(code) {
  process.exit(code);
});
