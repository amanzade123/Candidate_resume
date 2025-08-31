const express = require('express');
const router = express.Router();
const requireBasicAuth = require('../middleware/auth'); 

router.get('/login', requireBasicAuth, (req, res) => {
  const basicAuth = require('basic-auth');
  const user = basicAuth(req);
  res.json({ ok: true, user: user ? user.name : null });
});

module.exports = router;
