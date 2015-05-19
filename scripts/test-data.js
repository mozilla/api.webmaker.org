var spawn = require('cross-spawn');

var insert = spawn('psql', ['-d', 'webmaker_testing', '-f', 'scripts/test-data.sql'], {
  stdio: 'inherit'
});

insert.on('close', function(code) {
  process.exit(code);
});
