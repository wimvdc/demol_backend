const db = require("../db/push");
const webpush = require("web-push");
webpush.setVapidDetails("mailto: wim.vdc@hotmail.com", process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);

const now = new Date();

if (now.getDay() == 0 && now.getHours() == 19 && 45 >= now.getMinutes() && now.getMinutes() >= 40) {
  db.getAllSubscriptions().then((result) => {
    const payload = JSON.stringify({
      title: "De Mol '21 pronostiek",
      body: "Je hebt nog 15 minuten om te stemmen!",
      actions: [
        {
          action: "mollen",
          title: "Ik wil stemmen!",
          icon: "/img/icons/android-icon-192x192.jpg",
        },
      ],
    });

    for (i = 0; i < result.length; i++) {
      let subscription = {
        endpoint: result[i].endpoint,
        expirationTime: null,
        keys: {
          p256dh: result[i].p256,
          auth: result[i].auth,
        },
      };
      webpush
        .sendNotification(subscription, payload)
        .then((result) => console.info(result.statusCode))
        .catch((e) => console.error(e.stack));
    }

    setTimeout(function () {
      console.error("Should be done by now");
      process.exit(1);
    }, 5000);
  });
} else {
  console.error("Why execute? :/");
  console.error(new Date().getDay() + " " + new Date().getHours() + " " + now.getMinutes());
}
