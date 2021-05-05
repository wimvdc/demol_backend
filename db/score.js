const db = require("./utils");

exports.getAvailablePoints = function (userId) {
    return db.executeQuery(`SELECT available_points FROM users
                       WHERE uuid = ?`,
        [userId]);
};

exports.getGuessesForUser = function (userId, round) {
    return db.executeQuery(`SELECT * FROM point_guesses
                       WHERE user_uuid = ? and round = ?`,
        [userId, round]);
};

exports.getMolGuessesForUser = function (userId, molId) {
    return db.executeQuery(`SELECT IFNULL(SUM(points),0) as points FROM point_guesses
                            WHERE user_uuid = ? and mol_uuid = ?;`,
        [userId, molId]);
};

exports.getEndGuessForUser = function (userId, molId) {
    return db.executeQuery(`SELECT count(*) * 100 as points FROM endgame
                       WHERE user_uuid = ? and mol_uuid = ?`,
        [userId, molId]);
};

exports.getCandidatesOut = function () {
    return db.executeQuery(`SELECT uuid FROM candidates
                       WHERE isOut = 1`, []);
};

exports.getMol = function () {
    return db.executeQuery(`SELECT uuid FROM candidates
                       WHERE isMol = 1 and isOut = 0`, []);
};

exports.getAllUsers = function () {
    return db.executeQuery(`SELECT id, channel, uuid, available_points FROM users`);
};

exports.insertTempResult = function (userId, round, previousPoints, newPoints, plus, minus) {
    return db.executeQuery(`INSERT INTO points_result
                        (user_uuid, round, previous_points, new_points, plus, minus) VALUES (?,?,?,?,?,?);`
        , [userId, round, previousPoints, newPoints, plus, minus]);
};

exports.insertEndgameTempResult = function (userId, previousPoints, newPoints, plus) {
    return db.executeQuery(`INSERT INTO endgame_points_result
                        (user_uuid, previous_points, new_points, plus) VALUES (?,?,?,?);`
        , [userId, previousPoints, newPoints, plus]);
};

exports.getTempResultForRound = function (round) {
    return db.executeQuery(`SELECT user_uuid, new_points FROM points_result
                        WHERE round = ?;`, [round]);
};

exports.getEndgameTempResultForRound = function () {
    return db.executeQuery(`SELECT user_uuid, new_points FROM endgame_points_result;`, []);
};

exports.updateUserScore = function (userId, newPoints) {
    return db.executeQuery(`UPDATE users SET available_points = ? WHERE uuid = ?;`
        , [newPoints, userId]);
};