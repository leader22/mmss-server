const express = require('express');
const router = express.Router();

router.get('/', function(_, res) {
  res.json({ index: 1 });
});

router.get('/search', function(req, res) {
  console.log(req.query.q);
  res.json({ search: 1 });
});

module.exports = router;
