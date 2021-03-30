let router = require('express').Router();
const { isLoggedIn } = require("../utils/middelware");
let db = require('../db/feedback');

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const result = await db.getAdminCount(req.user.uuid);
    if (result.length >= 5) {
      res.status(400).json({ code: 7600 });
    } else {
      await db.insertFeedback(req.user.uuid, req.body.feedback);
      res.status(201).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: err.errno });
  }
});

module.exports = router;
