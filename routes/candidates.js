let router = require('express').Router();
const { getCurrentRound } = require("../utils/config");
let db = require('../db/candidates');

router.get('/', async (req, res, next) => {
  const result = await db.getCandidatesForGuess(getCurrentRound(), req.user.uuid)
  res.json(result);
});

module.exports = router;
