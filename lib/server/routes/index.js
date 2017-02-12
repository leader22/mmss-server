const express = require('express');
const router = express.Router();
const error = require('../error');
const mmss = require('../../mmss');

router.post('/login', (req, res) => {
  const id = req.body.id || '';
  const pw = req.body.pw || '';

  if (pw.length === 0 || id.length === 0) {
    return res.json({ error: error.INVALID_PARAMS });
  }

  if (!(mmss.user === id && mmss.pass === pw)) {
    return res.json({ error: error.LOGIN_FAILURE });
  }
  // TODO: okならsession

  res.json(null);
});

router.post('/logout', (_, res) => {
  // TODO: session破棄
  res.json(null);
});

router.get('/search', (req, res) => {
  const query = req.query.q || '';

  if (query.length === 0) {
    return res.json({ error: error.INVALID_PARAMS });
  }

  res.json(mmss.search(query.trim()));
});

module.exports = router;
