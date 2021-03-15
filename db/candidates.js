const db = require("./utils")

exports.getAllCandidates = function () {
    return db.executeQuery(`SELECT * FROM candidates ORDER BY isout, name;`);
};

exports.getAllActiveCandidates = function () {
    return db.executeQuery(`SELECT * FROM candidates where isOut = 0 ORDER BY name;`);
};

exports.getCandidatesForGuess = function (round, user_uuid) {
    return db.executeQuery(`SELECT c.name, c.uuid, c.isMol, c.isOut, p.points 
            FROM candidates  c
            LEFT JOIN point_guesses p ON c.uuid = p.mol_uuid and round = ? and user_uuid = ?
            ORDER BY isout, name;`
        , [round, user_uuid]);
};