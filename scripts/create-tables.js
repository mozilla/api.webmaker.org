var spawn = require('cross-spawn');

var create = spawn('psql', ['-d','webmaker_testing', '-f', 'scripts/create-tables.sql'], {
  stdio: 'inherit'
});

create.on('close', function(code) {
  process.exit(code);
});
