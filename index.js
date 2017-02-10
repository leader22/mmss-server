const argv = require('yargs')
  .usage('Usage: $0 --mpath [path/to/music/dir] --port [num]')
  .demandOption(['mpath'])
  .alias('p', 'port')
  .default('port', 8080)
  .argv;
console.log(`Starting app...\n  mpath: ${argv.mpath}\n  port:  ${argv.port}`);

const Mmss = require('./lib/mmss');
const server = require('./lib/server');

const mmss = new Mmss(argv.mpath);
mmss.build()
  .then(() => {
    server.listen(argv.port, () => {
      console.log(`App is running on port: ${argv.port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
