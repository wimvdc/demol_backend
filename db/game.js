const db = require("./utils");

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
