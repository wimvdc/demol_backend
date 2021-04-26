const db = require("./utils");

exports.getSpendPointsForUser = function (round, userid) {
    return db.executeQuery(`SELECT SUM(p.points) spend
        FROM point_guesses p 
        WHERE round = ? and user_uuid = ?`
        , [round, userid]);
};

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

exports.getEndgameGuess = function (userid) {
    return db.executeQuery(`SELECT mol_uuid uuid, mol_name
        FROM endgame WHERE user_uuid = ?`
        , [userid]);
};

exports.upsertEndgameGuess = function (userid, molid, molname) {
    return db.executeQuery(`INSERT INTO endgame
        (user_uuid, mol_uuid, mol_name) VALUES (?,?,?) 
        ON DUPLICATE KEY UPDATE
                        user_uuid = ?,
                        mol_uuid = ?,
                        mol_name = ?
    `
        , [userid, molid, molname, userid, molid, molname]);
};