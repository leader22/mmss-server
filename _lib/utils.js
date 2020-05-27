const os = require('os');
const crypto = require('crypto');

module.exports = {
  sha256(salt, pass) {
    return crypto.createHmac('sha256', salt).update(pass).digest('hex');
  },
  normalizeHomeDir(path) {
    return path.replace('~', os.homedir());
  }
};
