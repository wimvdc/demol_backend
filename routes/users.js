var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ "id": "123", "name": "De Flippers", "adminid": "hd67fhj7" });
});

router.get('/{groupid}', function (req, res, next) {
  const groupid = req.params.groupid
  res.json({ "id": groupid, "name": "De Flippers", "adminid": "hd67fhj7" });
});

module.exports = router;
