const fs = require('fs');
const { sha256 } = require('../utils');

class Mmss {

  constructor() {
    this.cred = null;
    this.path = '';
  }

  build(mpath, { user, pass }) {
    try {
      if (fs.statSync(mpath).isDirectory() === false) {
        throw new Error('Specified mpath is not a directory!');
      }

      if (user.length === 0 || pass.length === 0) {
        throw new Error('User or Pass is not passed!');
      }

      this.path = mpath;
      this.cred = sha256(user, pass);
    } catch(err) {
      return Promise.reject(err);
    }

    return Promise.resolve();
  }
}

module.exports = (new Mmss());
