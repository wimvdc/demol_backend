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

exports.getCandidatesOut = function () {
    return db.executeQuery(`SELECT uuid FROM candidates
                       WHERE isOut = 1`, []);
};

exports.getAllUsers = function () {
    return db.executeQuery(`SELECT id, channel, uuid, available_points FROM users`);
};

exports.insertTempResult = function (userId, round, previousPoints, newPoints, plus, minus) {
    return db.executeQuery(`INSERT INTO points_result
                        (user_uuid, round, previous_points, new_points, plus, minus) VALUES (?,?,?,?,?,?);`
        , [userId, round, previousPoints, newPoints, plus, minus]);
};

exports.getTempResultForRound = function (round) {
    return db.executeQuery(`SELECT user_uuid, new_points FROM points_result
                        WHERE round = ?`, [round]);
};

exports.updateUserScore = function (userId, newPoints) {
    return db.executeQuery(`UPDATE users SET available_points = ? WHERE uuid = ?;`
        , [newPoints, userId]);
};