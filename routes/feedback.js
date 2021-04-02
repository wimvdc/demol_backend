let router = require('express').Router();
const { isLoggedIn } = require("../utils/middelware");
let db = require('../db/feedback');

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const result = await db.getUserFeedback(req.user.uuid);
    if (result.length >= 5) {
      res.status(400).json({ code: 7600 });
    } else {
      const feedback = sanitizeString(req.body.feedback);
      const email = sanitizeString(req.body.email);
      await db.insertFeedback(feedback, email, req.user.uuid);
      res.status(201).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: err.errno });
  }
});

function sanitizeString(str) {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
}

module.exports = router;
