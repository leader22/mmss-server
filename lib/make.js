const jsmediatags = require('jsmediatags');
const fs = require('graceful-fs');
const path = require('path');
const recursive = require('recursive-readdir');
const jschardet = require('jschardet');

const getFilePathArrByDir = (dir) => {
  return new Promise((resolve, reject) => {
    recursive(dir, (err, files) => {
      if (err) { reject(err); }
      resolve(files);
    });
  });
};

const formatMediatagRes = (res, filePath) => {
  const tags = {
    title: res.tags.title,
    artist: res.tags.artist,
    album: res.tags.album,
    track: res.tags.track,
  };

  if (jschardet.detect(tags.title).encoding !== 'ascii') {
    const paths = path.parse(filePath);
    const [artist, title] = paths.name.split(' - ');

    tags.title = title;
    tags.artist = artist;
    tags.album = paths.dir.split('/').pop();
  }

  return tags;
};

const func = module.exports = (mpath) => {
  return new Promise((res, rej) => {
    const artistPathArr = [];
    const artists = fs.readdirSync(mpath);
    for (let i = 0; i < artists.length; i++) {
      const artist = artists[i];
      if (artist.charAt(0) === '.') { continue; }

      const artistPath = `${mpath}/${artist}`;
      const isDir = fs.statSync(artistPath).isDirectory();
      if (isDir === false) { continue; }

      artistPathArr.push(artistPath);
    }

    let filePathArr = [];
    const tasks = [];
    for (let i = 0; i < artistPathArr.length; i++) {
      const artistPath = artistPathArr[i];
      tasks.push(getFilePathArrByDir(artistPath).then(files => { filePathArr = filePathArr.concat(files); }));
    }

    Promise.all(tasks).then(() => {
      const tree = {};
      const tasks = [];
      // XXX: 今の作りだと、ファイルが多すぎてこれでファイルハンドルの上限に引っかかる
      //      graceful-fsにしてもダメなので、根本的になんかしないとダメ
      // const _filePathArr = filePathArr.slice(0, 60);
      for (let i = 0; i < filePathArr.length; i++) {
        const filePath = filePathArr[i];
        tasks.push(new Promise((resolve, reject) => {
          new jsmediatags.Reader(filePath)
            .setTagsToRead(['title', 'album', 'artist', 'track'])
            .read({
              onSuccess: (res) => {
                res = formatMediatagRes(res, filePath);
                const artist = res.artist;
                const album = res.album;
                const title = res.title;
                const track = res.track;

                tree[artist] = tree[artist] || {};
                tree[artist][album] = tree[artist][album] || { songs: [] };
                tree[artist][album].songs.push({
                  album: album,
                  artist: artist,
                  title: title,
                  track: track,
                  path: filePath,
                });

                resolve();
              },
              onError: (err) => reject(err),
            });
        }));
      }

      Promise.all(tasks).then(() => res(tree)).catch(rej);
    }).catch(rej);

  });
};

console.time('make');
func('/home/leader22/Music')
  .then((tree) => {
    console.timeEnd('make');
    console.log(JSON.stringify(tree, null, 2));
    tree;
  })
  .catch(err => { console.error(err); });
