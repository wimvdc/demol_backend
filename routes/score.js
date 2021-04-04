let router = require('express').Router();
const { isAdminLoggedIn } = require("../utils/middelware");
let db = require('../db/score');

router.get('/calculate/', isAdminLoggedIn, async (req, res, next) => {
  const result = {
    one: "/v1/score/calculate/temp",
    two: "/v1/score/calculate/update"
  }
  res.json(result);
});


router.get('/calculate/temp', isAdminLoggedIn, async (req, res, next) => {
  try {
    const out = await db.getCandidatesOut();
    let losers = [];
    out.forEach(element => { losers.push(element.uuid) });
    const users = await db.getAllUsers();
    const round = 2;
    for (let user of users) {
      let spendable = user.available_points
      const guesses = await db.getGuessesForUser(user.uuid, round);
      let won = 0, totalguessed = 0, lost = 0;
      guesses.forEach(guess => {
        totalguessed += guess.points;
        if (losers.includes(guess.mol_uuid))
          lost += guess.points;
        else
          won += guess.points;
      });
      let newscore = (won * 2) + (spendable - totalguessed) - lost
      newscore = newscore <= 0 ? 3 : newscore + 3;
      console.log(`${user.uuid} now has ${newscore}`)
      db.insertTempResult(user.uuid, round, spendable, newscore, won, lost)
    }

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: err.errno });
  }
});

router.get('/calculate/update', isAdminLoggedIn, async (req, res, next) => {
  const round = 2;
  const temp = await db.getTempResultForRound(1);
  for (let score of temp) {
    db.updateUserScore(score.user_uuid, score.new_points);
  }
  res.status(200).end();
});

module.exports = router;
