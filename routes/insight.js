const express = require('express');
const router = express.Router();
const db = require('../db/insight');
const { cache } = require("../utils/middelware");

router.get('/points/all', cache(90), async (req, res, next) => {
  const result = await getPointsPerRound(req, "all")
  res.json(result);
});

router.get('/points/me', async (req, res, next) => {
  const result = await getPointsPerRound(req, "me")
  res.json(result)
});

async function  getPointsPerRound(req, who){
  const round = Number(req.query.round);
  if (round && who === 'me') {
    return await db.pointsPerRoundPerUser(round, req.user.uuid);
} else if(round && who === 'all') {
  return await db.pointsPerRound(round);
} else {
  return [];
}

}


module.exports = router;
