const db = require("./utils");

exports.pointsPerRound = function (round) {
    return db.executeQuery(`SELECT sum(points) points, c.name,  c.color
                        FROM point_guesses  pg, candidates c
                        WHERE round = ? and pg.mol_uuid = c.uuid
                        GROUP BY c.name, c.color
                        ORDER BY c.name;
    `, [round]);
};

exports.pointsPerRoundPerUser = function (round, userUuid) {
    return db.executeQuery(`SELECT sum(points) points, c.name, c.color
                        FROM point_guesses  pg, candidates c
                        WHERE round = ? and pg.mol_uuid = c.uuid and pg.user_uuid = ?
                        GROUP BY c.name, c.color
                        ORDER BY c.name;
    `, [round, userUuid]);
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