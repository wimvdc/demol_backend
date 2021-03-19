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
                       WHERE isOut = 1`,[]);
};

exports.getAllUsers = function () {
    return db.executeQuery(`SELECT channel, uuid FROM users`);
};