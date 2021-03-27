const express = require('express');
const webpush = require('web-push');
webpush.setVapidDetails("mailto: wim.vdc@hotmail.com", process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE)
const router = express.Router();
const { push } = require("../utils/config");
const db = require('../db/push');


router.get('/public', async (req, res, next) => {
  res.json(push.public);
});

router.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  await db.insertSubscription(subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, req.user.uuid)
  const payload = JSON.stringify({
    title: 'De Mol - Herringer',
    body: 'Je moet nog stemmen!',
  })

  webpush.sendNotification(subscription, payload)
    .then(result => console.log(result.statusCode))
    .catch(e => console.log(e.stack))

  res.status(200).json({ 'success': true })
});

router.get('/me', async (req, res, next) => {
  const result = await db.getSubscription(req.user.uuid)
  console.log(result)
  const payload = JSON.stringify({
    title: 'Gewoon een test',
    body: 'Stemmen!',
  })

  const subscription = {
    endpoint: result[0].endpoint,
    expirationTime: null,
    keys: {
      p256dh: result[0].p256,
      auth: result[0].auth
    }
  }
  console.log(subscription)
  webpush.sendNotification(subscription, payload)
    .then(result => console.log(result.statusCode))
    .catch(e => console.log(e.stack))

  res.status(200).json({ 'success': true })
});

module.exports = router;
