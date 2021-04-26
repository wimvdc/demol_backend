let express = require('express');
let router = express.Router();
const { getCurrentRound, isNormalVotingEnabled, isEndgameVotingEnabled } = require("../utils/config");
const db = require('../db/game');
const { getUserByUuid } = require('../db/auth');
const { getMyGroups } = require('../db/groups');

router.get('/info', async (req, res, next) => {
    const format = req.query.format;
    const round = getCurrentRound();
    let spend = await db.getSpendPointsForUser(round, req.user.uuid);
    spend = spend[0].spend;
    let spendable = await db.getSpendablePoints(req.user.uuid);
    spendable = spendable[0].available_points;
    let response = {
        round: round,
        spend,
        spendable,
        voteopen: isNormalVotingEnabled(),
        endgameopen: isEndgameVotingEnabled(),
    }
    if (format === "full") {
        const user = await getUserByUuid(req.user.uuid);
        const groups = await getMyGroups(req.user.uuid);
        response = {
            round: round,
            spend,
            spendable,
            user: user[0],
            voteopen: isNormalVotingEnabled(),
            endgameopen: isEndgameVotingEnabled(),
            groups
        };
    }
    res.json(response);
});

router.get('/round', async (req, res, next) => {
    const round = getCurrentRound();
    res.json({ round });
});

router.get('/mol', async (req, res, next) => {
    try {
        let result = await db.getPointGuessForUser(getCurrentRound(), req.user.uuid);
        if (result.length == 0)
            res.status(404).end();
        else
            res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

router.post('/mol', async (req, res, next) => {
    try {
        if (!isNormalVotingEnabled()) {
            res.status(400).json({ code: 420 });
        } else {
            let consumedPoints = req.body.reduce((acc, item) => acc + (item.points >= 0 ? item.points : 0), 0);
            let spendablePoints = await db.getSpendablePoints(req.user.uuid);
            spendablePoints = spendablePoints[0].available_points
            if (consumedPoints > spendablePoints) {
                res.status(400).json({ code: 310 });
            } else {
                await db.deletePointGuessForUser(getCurrentRound(), req.user.uuid);
                req.body.forEach(mol => {
                    if (mol.points >= 0)
                        db.upsertPointGuessForUser(mol.uuid, getCurrentRound(), req.user.uuid, mol.points);
                });
                res.status(200).end();
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

router.get('/endgame', async (req, res, next) => {
    try {
        if (!isEndgameVotingEnabled()) {
            res.status(400).json({ code: 420 });
        } else {
            let result = await db.getEndgameGuess(req.user.uuid);
            if (result.length == 0)
                res.status(404).end();
            else
                res.json(result[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

router.post('/endgame', async (req, res, next) => {
    try {
        if (!isEndgameVotingEnabled()) {
            res.status(400).json({ code: 420 });
        } else if (req.body && req.body.uuid && req.body.name) {
            await db.upsertEndgameGuess(req.user.uuid, req.body.uuid, req.body.name)
            res.status(200).end();
        } else {
            res.status(400).json({ code: 420 });
        }
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

module.exports = router;
