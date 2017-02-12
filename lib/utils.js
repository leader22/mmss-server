const crypto = require('crypto');

module.exports = {
  sha256: (salt, pass) => {
    return crypto.createHmac('sha256', salt).update(pass).digest('hex');
  },
};
