const db = require("./utils");

/* start old school */
exports.upsertGuessForUser = function (molid, round, userid) {
    return db.executeQuery(`INSERT INTO guesses
        (mol_uuid, round, user_uuid) VALUES (?,?,?) 
        ON DUPLICATE KEY UPDATE
                        mol_uuid = ?,
                        round = ?,
                        user_uuid = ?
    `, [molid, round, userid, molid, round, userid]);
};

exports.getGuessForUser = function (round, userid) {
    return db.executeQuery(`SELECT mol_uuid FROM guesses 
        WHERE round = ? and user_uuid = ?`
        , [round, userid]);
};

exports.getDetailedGuessForUser = function (round, userid) {
    return db.executeQuery(`SELECT name, c.uuid FROM guesses g, candidates c 
        WHERE round = ? and user_uuid = ? and mol_uuid = c.uuid;`
        , [round, userid]);
};
/* end old school */

exports.getPointGuessForUser = function (round, userid) {
    return db.executeQuery(`SELECT c.name, c.isMol, c.isOut, p.points 
        FROM point_guesses p, candidates c 
        WHERE round = ? and user_uuid = ? and p.mol_uuid = c.uuid`
        , [round, userid]);
};

exports.getSpendablePoints = function (userid) {
    return db.executeQuery(`SELECT available_points
        FROM users WHERE uuid = ?`
        , [userid]);
};

exports.upsertPointGuessForUser = function (molid, round, userid, points) {
    return db.executeQuery(`INSERT INTO point_guesses
        (mol_uuid, round, user_uuid, points) VALUES (?,?,?,?) 
        ON DUPLICATE KEY UPDATE
                        mol_uuid = ?,
                        round = ?,
                        user_uuid = ?,
                        points = ?
    `, [molid, round, userid, points, molid, round, userid, points]);
};

exports.deletePointGuessForUser = function (round, userId) {
    return db.executeQuery(`DELETE FROM point_guesses
                       WHERE round = ? and user_uuid = ?`,
        [round, userId]);
};