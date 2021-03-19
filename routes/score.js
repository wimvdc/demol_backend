let router = require('express').Router();
const { webbaseurl } = require("../utils/config");
let db = require('../db/score');

router.get('/', async (req, res, next) => {
  try {
    let wim_ = "3c6f448b-85c6-11eb-841a-42010a840022"; //fb
    //wim_ = "eea5bd41-84fb-11eb-841a-42010a840022"; //google
    const out = await db.getCandidatesOut();
    let losers = [];
    out.forEach(element => {losers.push(element.uuid)});
    const users = await db.getAllUsers();
    for (const user of users) {
      let spendable = await db.getAvailablePoints(user.uuid,1);
      spendable = spendable[0].available_points
      //console.log(spendable)
      const guesses = await db.getGuessesForUser(user.uuid,1);
      let won = 0, totalguessed = 0, lost = 0;
      guesses.forEach(guess => {
          totalguessed+= guess.points;
        if(losers.includes(guess.mol_uuid))
            lost+= guess.points;
          else
            won+=guess.points;
      });
      //console.log("won: " + won)
      //console.log("lost: " + lost)
      //console.log("left: " + (spendable - totalguessed))
      let newscore = (won*2)  + (spendable - totalguessed) - lost
      newscore = newscore <= 0 ? 3 : newscore+3;
      console.log("new "+user.channel+" score: " + newscore)
    }
    
    if (result.length >= 5) {
      res.status(400).json({ code: 7600 });
    } else {
      //await db.insertGroup(req.body.name, req.body.public ? 1 : 0, req.user.uuid);
      await db.insertGroup(req.body.name, 0, req.user.uuid);
      res.status(201).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: err.errno });
  }
});


module.exports = router;
