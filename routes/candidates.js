let router = require('express').Router();
let db = require('../db/candidates');

router.get('/', async (req, res, next) => {
  const result = await db.getAllCandidates();
  res.json(result.map(({ id, ...rest }) => rest));
});

module.exports = router;
