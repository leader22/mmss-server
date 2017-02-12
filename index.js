const os = require('os');
const argv = require('yargs')
  .usage('Usage: $0 --mpath [path/to/music/dir] --user [username] --pass [password] --port [num]')
  .demandOption(['mpath', 'user', 'pass'])
  .default('port', 8080)
  .help()
  .argv;
const mmss = require('./lib/mmss');
const server = require('./lib/server');

const mpath = argv.mpath.replace('~', os.homedir());
const { port, user, pass }= argv;

console.log(`Starting app...
  mpath:     ${mpath}
  port:      ${port}
  user/pass: ${user}/${pass}
`);

mmss
  .build(mpath, { user, pass })
  .then(() => {
    server.listen(port, () => {
      console.log(`App is running on port: ${port}`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
