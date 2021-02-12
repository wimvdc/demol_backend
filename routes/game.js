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
    let result = await db.getDetailedGuessForUser(getCurrentRound(), req.user.uuid);
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
        let result = await db.getGuessForUser(getCurrentRound(), req.user.uuid);
        if (result.length == 1)
            res.json(result[0]);
        else
            res.status(404).end();
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

router.post('/mol', async (req, res, next) => {
    try {
        await db.upsertGuessForUser(req.body.mol_uuid, getCurrentRound(), req.user.uuid);
        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

module.exports = router;
