const db = require("./utils");

exports.insertFeedback = (uuid, feedback) => {
    return db.executeQuery(`INSERT INTO feedback
        (user_uuid, feedback) VALUES (?,?);
    `, [uuid, feedback]);
};


exports.getUserFeedbackCount = (uuid) => {
    return db.executeQuery(`SELECT id FROM feedback 
    WHERE user_uuid = ?;`, [uuid]);
};