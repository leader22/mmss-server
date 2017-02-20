const fs = require('fs');
const express = require('express');
const router = express.Router();
const error = require('../error');
const mmss = require('../../mmss');

const isLogin = (req, res, next) => {
  if (req.session.isLogin) {
    return next();
  }
  res.json({ error: error.AUTHORIZATION_REQUIRED });
};

router.get('/check', isLogin, (_, res) => {
  res.json(null);
});

router.get('/track', isLogin, (req, res) => {
  const path = `${mmss.path}/${req.query.path}`;

  // あるかないか見ておく
  try {
    fs.statSync(path);
  } catch (err) {
    return res.json({ error: error.INVALID_PARAMS });
  }

  res.set({ 'Content-Type': 'audio/mpeg' });
  fs.createReadStream(path).pipe(res);
});

module.exports = router;
