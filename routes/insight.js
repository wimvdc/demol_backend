const express = require('express');
const router = express.Router();
const db = require('../db/insight');
const { cache } = require("../utils/middelware");

router.get('/points/:who', cache(2), async (req, res, next) => {
  const who = req.params.who;
  const round = Number(req.query.round);
  if (who && round) {
    if (who === 'all') {
      const result = await db.pointsPerRound(round);
      res.json(result);
    }
    if (who === 'me') {
      const result = await db.pointsPerRoundPerUser(round, req.user.uuid);
      res.json(result);
    }
  } else {
    res.json([]);
  }
});


module.exports = router;
