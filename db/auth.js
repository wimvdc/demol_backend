const db = require("./utils");

exports.getUserIdByOpenId = function (openid) {
    return db.executeQuery(`SELECT uuid FROM users WHERE openid = ?;`, [openid]);
};

exports.getUserByUuid = function (uuid) {
    return db.executeQuery(`SELECT firstName firstname FROM users WHERE uuid = ?;`, [uuid]);
};

exports.insertUser = function (openid, firstname, lastname, channel) {
    return db.executeQuery(`INSERT INTO users (openid, firstName, lastName, channel)
                       SELECT ? , ? , ? , ?
                       FROM dual
                       WHERE NOT EXISTS (SELECT 1 FROM users WHERE openid=?)`,
        [openid, firstname, lastname, channel, openid]);
};