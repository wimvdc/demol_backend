const db = require("./utils");

exports.getMe = function (userUuid) {
    return db.executeQuery(`SELECT IFNULL(nickname, "") alias
            FROM users WHERE uuid = ?;
    `, [userUuid]);
};

exports.getByNickname = function (nickname, userUuid) {
    return db.executeQuery(`SELECT * 
            FROM users WHERE lower(nickname) = lower(?) and uuid != ?;
    `, [nickname, userUuid]);
};

exports.updateUser = function (nickname, userUuid) {
    return db.executeQuery(`UPDATE users
        SET nickname = ? WHERE uuid = ?;
    `, [nickname, userUuid]);
};