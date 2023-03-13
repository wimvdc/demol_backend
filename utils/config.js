require("dotenv").config();
const currentWeekNumber = require("current-week-number");

//Use index as round number
const rounds = [
  new Date("2022-12-29T20:00:00"),
  new Date("2023-01-07T20:00:00"),
  new Date("2023-04-04T20:00:00"),
  new Date("2023-04-11T20:00:00"),
  new Date("2023-04-18T20:00:00"),
  new Date("2023-04-25T20:00:00"),
  new Date("2023-05-02T20:00:00"),
  new Date("2023-05-09T20:00:00"),
  new Date("2023-05-21T20:00:00"),
];

module.exports = {
  port: process.env.PORT,
  hostname: process.env.HOSTNAME,
  database: {
    connectionLimit: process.env.DB_CONN_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    multipleStatements: false,
  },
  webbaseurl: process.env.WEB_BASE_URL,
  serverurl: process.env.SERVER_URL,
  databaseUnsafe: {
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    multipleStatements: true,
  },
  google: {
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
    accessType: "offline",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  facebook: {
    clientID: process.env.FB_AUTH_CLIENT_ID,
    clientSecret: process.env.FB_AUTH_CLIENT_SECRET,
    callbackURL: process.env.FB_AUTH_CALLBACK,
    profileFields: ["id", "displayName"],
  },
  getCurrentRound: () => {
    const now = new Date();
    for (i = 1; i < rounds.length; i++) {
      if (now.getTime() <= rounds[i].getTime() && now.getTime() >= rounds[i - 1].getTime()) {
        //console.info(`${rounds[i-1]} and ${rounds[i]}`)
        return i;
      }
    }
    return 0;
  },
  getLastRound: () => {
    return 7;
  },
  isNormalVotingEnabled: () => {
    const now = new Date();
    if (now.getDay() == 0) {
      if (now.getHours() == 20 || (now.getHours() == 21 && now.getMinutes() < 30)) {
        return false;
      }
    }
    return 0 < module.exports.getCurrentRound() && module.exports.getCurrentRound() < module.exports.getLastRound();
  },
  isEndgameVotingEnabled: () => {
    return module.exports.getCurrentRound() == module.exports.getLastRound();
  },
};
