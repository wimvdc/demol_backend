let express = require('express');
let router = express.Router();
const { getCurrentRound } = require("../utils/config");
const db = require('../db/game');
const { getUserByUuid } = require('../db/auth');
const { getMyGroups } = require('../db/groups');

router.get('/round', (req, res, next) => {
    res.json({ "round": getCurrentRound() });
});

router.get('/info', async (req, res, next) => {
    let result = []; //fix
    let user = await getUserByUuid(req.user.uuid);
    let groups = await getMyGroups(req.user.uuid);
    res.json({
        round: getCurrentRound(),
        voted: result.length == 1,
        vote: result.length == 1 ?
            result[0] : null,
        user: user[0],
        groups
    });
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
        let consumedPoints = req.body.reduce((acc, item) => acc + (item.points >= 0 ? item.points : 0), 0);
        let spendablePoints = await db.getSpendablePoints(req.user.uuid);
        spendablePoints = spendablePoints[0].available_points
        console.log(consumedPoints + " - " + spendablePoints)
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
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

module.exports = router;
