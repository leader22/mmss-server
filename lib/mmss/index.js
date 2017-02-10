const fs = require('fs');
const utils = require('../utils');

class Mmss {

  constructor(mpath) {
    this.mpath = mpath;
  }

  build() {
    try {
      if (fs.statSync(this.mpath).isDirectory() === false) {
        throw new Error('Specified mpath is not a directory!');
      }
    } catch(err) {
      return Promise.reject(err);
    }

    return new Promise((resolve, reject) => {
      utils.dir2obj(this.mpath, (err, res) => {
        if (err) { reject(err); }
        console.log(res);

        resolve();
      });
    });
  }

}

module.exports = Mmss;
