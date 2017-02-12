const express = require('express');
const router = express.Router();
const error = require('../../error');
const mmss = require('../../mmss');

router.get('/login', function(_, res) {
  res.json({ index: 1 });
});

router.get('/search', function(req, res) {
  const query = req.query.q || '';

  if (query.length === 0) {
    return res.json({ error: error.INVALID_PARAMS });
  }

  res.json(mmss.search(query.trim()));
});

module.exports = router;
