const os = require('os');
const argv = require('yargs')
  .usage('Usage: $0 --mpath [path/to/music/dir] --port [num]')
  .demandOption(['mpath'])
  .alias('p', 'port')
  .default('port', 8080)
  .argv;

const mpath = argv.mpath.replace('~', os.homedir());
const port = argv.port;

console.log(`Starting app...\n  mpath: ${mpath}\n  port:  ${port}`);

const mmss = require('./lib/mmss');
const server = require('./lib/server');

mmss
  .init(mpath)
  .build()
  .then(() => {
    server.listen(port, () => {
      console.log(`App is running on port: ${port}`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
