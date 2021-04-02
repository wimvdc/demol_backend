const db = require("./utils");

exports.insertFeedback = (feedback, email, uuid) => {
    return db.executeQuery(`INSERT INTO feedback
        (user_uuid, feedback, email) VALUES (?,?,?);
    `, [uuid, feedback, email]);
};


exports.getUserFeedback = (uuid) => {
    return db.executeQuery(`SELECT id FROM feedback 
    WHERE user_uuid = ?;`, [uuid]);
};