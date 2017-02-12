const express = require('express');
const router = express.Router();
const error = require('../../error');
const mmss = require('../../mmss');

router.get('/login', function(req, res) {
  const id = req.query.id || '';
  const pw = req.query.pw || '';

  if (!(pw.length && id.length)) {
    return res.json({ error: error.INVALID_PARAMS });
  }

  // TODO: id/pwチェック -> 起動時に渡す
  // TODO: okならsession

  res.json({ todo: 1 });
});

router.get('/search', function(req, res) {
  const query = req.query.q || '';

  if (query.length === 0) {
    return res.json({ error: error.INVALID_PARAMS });
  }

  res.json(mmss.search(query.trim()));
});

module.exports = router;
