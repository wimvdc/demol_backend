let router = require('express').Router();
const { isLoggedIn, cache } = require("../utils/middelware");
const { webbaseurl } = require("../utils/config");
let db = require('../db/groups');

router.get('/', isLoggedIn, async (req, res, next) => {
  const result = await db.getAllGroups(req.user.uuid);
  res.json(result);
});

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const result = await db.getAdminCount(req.user.uuid);
    if (result.length >= 5) {
      res.status(400).json({ code: 7600 });
    } else {
      await db.insertGroup(req.body.name, 0, req.user.uuid);
      res.status(201).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: err.errno });
  }
});

router.get('/:groupid', isLoggedIn, cache(30), async (req, res, next) => {
  const groupid = req.params.groupid;
  if (groupid === 'public') {
    res.json({ name: "Publiek", uuid: "public" });
  } else {
    const result = await db.getGroupByUuid(groupid);
    if (result.length != 1)
      res.status(404).end();
    else {
      let group = result[0];
      group.share = `${webbaseurl}/group/invite/${group.uuid}`;
      delete group.share_code;
      res.json(result[0]);
    }
  }
});

router.get('/:groupid/users', isLoggedIn, cache(30), async (req, res, next) => {
  const groupid = req.params.groupid;
  if (groupid === 'public') {
    const result = await db.getAllUsers();
    res.json(result);
  } else {
    const result = await db.getUsersInGroup(groupid);
    if (result.length === 0)
      res.status(404).end();
    else
      res.json(result);
  }

});

router.get('/invite/:invitecode', async (req, res, next) => {
  const invitecode = req.params.invitecode;
  console.log(req.path)
  if (!req.user?.uuid) {
    res.redirect(`${webbaseurl}/login?referer=${webbaseurl}${req.path}`)
  }
  const groups = await db.getGroupByUuid(invitecode);
  if (groups.length == 1) {
    try {
      await db.insertUserinGroup(groups[0].uuid, req.user.uuid);
      res.json({ uuid: groups[0].uuid });
    } catch (error) {
      if (error.errno == 1062)
        res.json({ uuid: groups[0].uuid });
      else
        res.status(500).end();
    }
  } else {
    res.status(404).end();
  }

});

module.exports = router;
