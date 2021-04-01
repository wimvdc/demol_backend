const db = require("./utils");

exports.getMe = function (userUuid) {
    return db.executeQuery(`SELECT IFNULL(nickname, "") alias, isPublic public
            FROM users WHERE uuid = ?;
    `, [userUuid]);
};

exports.getByNickname = function (nickname, userUuid) {
    return db.executeQuery(`SELECT * 
            FROM users WHERE lower(nickname) = lower(?) and uuid != ?;
    `, [nickname, userUuid]);
};

exports.updateUser = function (nickname, showInPublic, userUuid) {
    return db.executeQuery(`UPDATE users
        SET nickname = ?, isPublic = ? WHERE uuid = ?;
    `, [nickname, showInPublic, userUuid]);
};