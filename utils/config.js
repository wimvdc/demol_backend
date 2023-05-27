require("dotenv").config();
const currentWeekNumber = require("current-week-number");

//Use index as round number
const rounds = [
  new Date("2023-03-19T20:00:00+0100"),
  new Date("2023-03-26T20:00:00+0200"), //summertime
  new Date("2023-04-02T20:00:00+0200"), //summertime
  new Date("2023-04-09T20:00:00+0200"), //summertime
  new Date("2023-04-16T20:00:00+0200"), //summertime
  new Date("2023-04-23T20:00:00+0200"), //summertime
  new Date("2023-04-30T20:00:00+0200"), //summertime
  new Date("2023-05-07T20:00:00+0200"), //summertime
  new Date("2023-05-14T20:00:00+0200"), //summertime
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
      if (now <= rounds[i] && now >= rounds[i - 1]) {
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
    return false;
    // if (now.getDay() == 0) {
    //   if (now.getHours() == 20 || (now.getHours() == 21 && now.getMinutes() < 30)) {
    //     return false;
    //   }
    // }
    // return 0 < module.exports.getCurrentRound() && module.exports.getCurrentRound() < module.exports.getLastRound();
  },
  isEndgameVotingEnabled: () => {
    return module.exports.getCurrentRound() == module.exports.getLastRound();
  },
};
