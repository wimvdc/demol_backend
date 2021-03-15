require("dotenv").config();
const currentWeekNumber = require("current-week-number");

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
        multipleStatements: false
    },
    webbaseurl: process.env.WEB_BASE_URL,
    serverurl: process.env.SERVER_URL,
    databaseUnsafe: {
        connectionLimit: 2,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA,
        multipleStatements: true
    },
    google: {
        clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
        accessType: "offline",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    facebook: {
        clientID: process.env.FB_AUTH_CLIENT_ID,
        clientSecret: process.env.FB_AUTH_CLIENT_SECRET,
        callbackURL: process.env.FB_AUTH_CALLBACK,
        profileFields: ['id', 'displayName', 'emails']

    },
    getCurrentRound: () => {
        let round = currentWeekNumber() - 10;
        let now = new Date();
        if (now.getDay() == 0) {
            if (now.getHours() > 21) {
                round++;
            }
        }
        return round;
    }
};

