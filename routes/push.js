const express = require("express");
const webpush = require("web-push");
webpush.setVapidDetails("mailto: wim.vdc@hotmail.com", process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
const router = express.Router();
const { push } = require("../utils/config");
const { cache } = require("../utils/middelware");
const db = require("../db/push");

router.get("/public", cache(600), async (req, res, next) => {
  res.json(push.public);
});

router.post("/unsubscribe", async (req, res) => {
  try {
    await db.deleteSubscription(req.user.uuid);
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

router.post("/subscribe", async (req, res) => {
  const subscription = req.body;
  await db.insertSubscription(subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, req.user.uuid);
  const payload = JSON.stringify({
    title: "De Mol '21 pronostiek",
    body: "Push notificatie is actief!",
  });

  webpush
    .sendNotification(subscription, payload)
    .then((result) => console.log(result.statusCode))
    .catch((e) => console.log(e.stack));

  res.status(201).end();
});

router.get("/me", async (req, res, next) => {
  // const result = await db.getSubscription(req.user.uuid);
  // const payload = JSON.stringify({
  //   title: "De Mol '23 pronostiek",
  //   body: "Je hebt nog 15 minuten om te stemmen!",
  //   actions: [
  //     {
  //       action: "mollen",
  //       title: "Ik wil stemmen!",
  //       icon: "/img/icons/android-icon-192x192.jpg",
  //     },
  //   ],
  // });

  // const subscription = {
  //   endpoint: result[0].endpoint,
  //   expirationTime: null,
  //   keys: {
  //     p256dh: result[0].p256,
  //     auth: result[0].auth,
  //   },
  // };
  // webpush
  //   .sendNotification(subscription, payload)
  //   .then((result) => console.log(result.statusCode))
  //   .catch((e) => console.log(e.stack));

  res.status(200).json({ success: true });
});

module.exports = router;
