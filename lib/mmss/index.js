const fs = require('fs');

class Mmss {
  build(mpath) {
    try {
      if (fs.statSync(mpath).isDirectory() === false) {
        throw new Error('Specified mpath is not a directory!');
      }

      this.json = require(`${mpath}/music.json`);
    } catch(err) {
      return Promise.reject(err);
    }

    return Promise.resolve();
  }
}

module.exports = (new Mmss());
