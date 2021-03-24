let router = require('express').Router();
const { serverurl } = require("../utils/config");
const { isAdminLoggedIn } = require("../utils/middelware");
let db = require('../db/score');


router.get('/', isAdminLoggedIn, (req, res, next) => {
  res.json({
    type: "btn", text: "do score", destination: serverurl + "/cookies"
  })
});
router.get('/x', async (req, res, next) => {
  try {
    const out = await db.getCandidatesOut();
    let losers = [], newPoints = [];
    out.forEach(element => { losers.push(element.uuid) });
    const users = await db.getAllUsers();
    const round = 1;
    for (const user of users) {
      //let spendable = await db.getAvailablePoints(user.uuid, 1);
      let spendable = user.available_points
      //console.log(spendable)
      const guesses = await db.getGuessesForUser(user.uuid, round);
      let won = 0, totalguessed = 0, lost = 0;
      guesses.forEach(guess => {
        totalguessed += guess.points;
        if (losers.includes(guess.mol_uuid))
          lost += guess.points;
        else
          won += guess.points;
      });
      //console.log("won: " + won)
      //console.log("lost: " + lost)
      //console.log("left: " + (spendable - totalguessed))
      let newscore = (won * 2) + (spendable - totalguessed) - lost
      newscore = newscore <= 0 ? 3 : newscore + 3;
      //newPoints.push({ userId: user.id, oldScore: spendable, newScore: newscore })
      db.insertTempResult(user.uuid, round, spendable, newscore, won, lost)
      console.log("new " + user.id + " score: " + newscore)

    }

    if (newPoints.length > 5) {
      res.status(200).end();
    } else {
      //await db.insertGroup(req.body.name, req.body.public ? 1 : 0, req.user.uuid);
      //await db.insertGroup(req.body.name, 0, req.user.uuid);
      res.status(201).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: err.errno });
  }
});


module.exports = router;
