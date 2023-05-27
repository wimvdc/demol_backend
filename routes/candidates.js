let router = require("express").Router();
const { getCurrentRound } = require("../utils/config");
let db = require("../db/candidates");

router.get("/", async (req, res, next) => {
  try {
    const result = await db.getCandidatesForGuess(getCurrentRound(), req.user.uuid);
    res.json(result);
  } catch (error) {
    console.error(req.user.uuid);
    console.error(error);
  }
});

module.exports = router;
