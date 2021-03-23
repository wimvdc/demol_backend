const express = require('express');
const router = express.Router();
const db = require('../db/users');

router.get('/', async (req, res, next) => {
  const me = await db.getMe(req.user.uuid);
  res.json(me[0]);
});

router.put('/', async (req, res, next) => {
  const nickname = sanitizeString(req.body.alias);
  if (!nickname || nickname.length > 55 || nickname.length < 3) {
    res.status(400).json({ code: 430 });
  }
  const exists = await db.getByNickname(nickname, req.user.uuid)
  if (exists.length == 0) {
    try {
      await db.updateUser(nickname, req.user.uuid)
      const me = await db.getMe(req.user.uuid);
      res.json(me[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ code: err.errno });
    }
  } else {
    res.status(500).json({ code: 1062 });
  }
});

function sanitizeString(str) {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
}

module.exports = router;
