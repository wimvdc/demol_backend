let router = require('express').Router();
const { isLoggedIn } = require("../utils/middelware");
const { serverurl, webbaseurl } = require("../utils/config");
let db = require('../db/groups');

router.get('/', isLoggedIn, async (req, res, next) => {
  const result = await db.getAllGroups();
  res.json(result.map(({ admin_uuid, ...rest }) => rest));
});

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const result = await db.getAdminCount(req.user.uuid);
    if (result.length >= 5) {
      res.status(400).json({ code: 7600 });
    } else {
      await db.insertGroup(req.body.name, req.body.public ? 1 : 0, req.user.uuid);
      res.status(201).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: err.errno });
  }
});

router.get('/:groupid', isLoggedIn, async (req, res, next) => {
  const groupid = req.params.groupid;
  const result = await db.getGroupByUuid(groupid);
  if (result.length != 1)
    res.status(404).end();
  else {
    let group = result[0];
    group.share = `${serverurl}/v1/groups/invite/${group.share_code}`;
    delete group.share_code;
    res.json(result[0]);
  }
});

router.get('/:groupid/users', isLoggedIn, async (req, res, next) => {
  const groupid = req.params.groupid;
  const result = await db.getUsersInGroup(groupid);
  if (result.length === 0)
    res.status(404).end();
  else
    res.json(result);
});

router.put('/:groupid', isLoggedIn, async (req, res, next) => {
  try {
    const groupid = req.params.groupid;
    await db.updateGroup(groupid, req.body.name, req.body.public ? 1 : 0);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

router.get('/invite/:invitecode', async (req, res, next) => {
  const invitecode = req.params.invitecode;
  console.log(req.path)
  if (!req.user?.uuid) {
    res.redirect(`${webbaseurl}/login?referer=${serverurl}${req.path}`)
  }
  const groups = await db.getGroupByInviteCode(invitecode);
  if (groups.length == 1) {
    try {
      const result = await db.insertUserinGroup(groups[0].uuid, req.user.uuid);
      res.redirect(`${webbaseurl}/groups/${groups[0].uuid}`)
    } catch (error) {
      if (error.errno == 1062)
        res.status(200).end();
      else
        res.status(500).end();
    }
  } else {
    res.status(404).end();
  }

});

/*
    db.getGroupByCode(req.params.code).then(group => {
      let groupId = group[0].id;
      let userId = req.user.molid;
      db.insertUserIntoGroup(userId, groupId).then(() => {
        res.render("pages/index.ejs", {
          partialName: "../partials/groups/invite",
          items: {
            group: group[0]
          },
          page: req.active_page
        });
      });
    });
*/

module.exports = router;
