const express = require('express');
const router = express.Router();
const error = require('../error');
const { sha256 } = require('../../utils');
const mmss = require('../../mmss');

router.post('/login', (req, res) => {
  const id = req.body.id || '';
  const pw = req.body.pw || '';

  if (pw.length === 0 || id.length === 0) {
    return res.status(400).json({ error: error.INVALID_PARAMS });
  }

  if (mmss.cred !== sha256(id, pw)) {
    return res.status(403).json({ error: error.LOGIN_FAILURE });
  }

  req.session.isLogin = true;
  res.json(null);
});

router.post('/logout', (req, res) => {
  delete req.session.isLogin;
  res.json(null);
});

module.exports = router;
