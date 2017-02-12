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
