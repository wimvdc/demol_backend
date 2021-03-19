let router = require('express').Router();
const { isLoggedIn } = require("../utils/middelware");
const { webbaseurl } = require("../utils/config");
let db = require('../db/groups');

router.get('/', isLoggedIn, async (req, res, next) => {
  const result = await db.getAllGroups(req.user.uuid);
  res.json(result);
});

router.post('/', async (req, res, next) => {
  try {
    const result = await db.getAdminCount(req.user.uuid);
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

router.get('/:groupid', async (req, res, next) => {
  const groupid = req.params.groupid;
  const result = await db.getGroupByUuid(groupid);
  if (result.length != 1)
    res.status(404).end();
  else {
    let group = result[0];
    group.share = `${webbaseurl}/group/invite/${group.uuid}`;
    delete group.share_code;
    res.json(result[0]);
  }
});

router.get('/:groupid/users', async (req, res, next) => {
  const groupid = req.params.groupid;
  const result = await db.getUsersInGroup(groupid);
  if (result.length === 0)
    res.status(404).end();
  else
    res.json(result);
});

/*router.put('/:groupid', async (req, res, next) => {
  try {
    const groupid = req.params.groupid;
    await db.updateGroup(groupid, req.body.name, req.body.public ? 1 : 0);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});*/

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
