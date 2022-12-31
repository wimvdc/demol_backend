const db = require("./utils");

exports.getMe = function (userUuid) {
  return db.executeQuery(
    `SELECT IF(ISNULL(nickname), CONCAT(firstName," ",UPPER(LEFT (lastName, 1))), nickname)  publicName, 
            IFNULL(nickname, "") alias, is_public public
            FROM users WHERE uuid = ?;
    `,
    [userUuid]
  );
};

exports.getByNickname = function (nickname, userUuid) {
  return db.executeQuery(
    `SELECT * 
            FROM users WHERE lower(nickname) = lower(?) and uuid != ?;
    `,
    [nickname, userUuid]
  );
};

exports.updateUser = function (nickname, showInPublic, userUuid) {
  return db.executeQuery(
    `UPDATE users
        SET nickname = ?, is_public = ? WHERE uuid = ?;
    `,
    [nickname, showInPublic, userUuid]
  );
};
