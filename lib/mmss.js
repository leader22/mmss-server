const fs = require('fs');
const { sha256, normalizeHomeDir } = require('./utils');

class Mmss {
  constructor() {
    this.cred = null;
    this.path = '';
  }

  async build(mpath, { user, pass }) {
    mpath = normalizeHomeDir(mpath);

    if (fs.statSync(mpath).isDirectory() === false) {
      throw new Error('Specified mpath is not a directory!');
    }

    if (user.length === 0 || pass.length === 0) {
      throw new Error('User or Pass is not passed!');
    }

    this.path = mpath;
    this.cred = sha256(user, pass);
  }
}

module.exports = (new Mmss());
