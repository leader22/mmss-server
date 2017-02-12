const fs = require('fs');
const { sha256 } = require('../utils');

class Mmss {

  constructor() {
    this.cred = null;
    this.json = {};
  }

  build(mpath, { user, pass }) {
    try {
      if (fs.statSync(mpath).isDirectory() === false) {
        throw new Error('Specified mpath is not a directory!');
      }

      if (user.length === 0 || pass.length === 0) {
        throw new Error('User or Pass is not passed!');
      }

      this.json = require(`${mpath}/music.json`);
      this.cred = sha256(user, pass);
    } catch(err) {
      return Promise.reject(err);
    }

    return Promise.resolve();
  }

  search(query) {
    const reg = new RegExp(query, 'i');

    const res = [];
    Object.keys(this.json).forEach(artist => {
      if (reg.test(artist)) {
        res.push({
          artist: artist,
          albums: Object.keys(this.json[artist]),
        });
      }
    });

    return res;
  }
}

module.exports = (new Mmss());
