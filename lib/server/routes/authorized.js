const express = require('express');
const router = express.Router();
const error = require('../error');
// const mmss = require('../../mmss');

const isLogin = (req, res, next) => {
  if (req.session.isLogin) {
    return next();
  }

  res.json({ error: error.AUTHORIZATION_REQUIRED });
};

router.get('/check', isLogin, (req, res) => {
  const isLogin = req.session.isLogin;
  res.json(isLogin);
});

module.exports = router;
