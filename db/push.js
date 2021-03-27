const db = require("./utils");

exports.insertSubscription = function (endpoint, p256, auth, uuid) {
    return db.executeQuery(`INSERT INTO push_subscriptions
        (endpoint, p256, auth, user_uuid) VALUES (?,?,?,?) 
        ON DUPLICATE KEY UPDATE
                        endpoint = ?,
                        p256 = ?,
                        auth = ?,
                        user_uuid = ?
    `, [endpoint, p256, auth, uuid, endpoint, p256, auth, uuid]);
};

exports.deleteSubscription = function (uuid) {
    return db.executeQuery(`DELETE FROM push_subscriptions WHERE user_uuid = ?`, [uuid]);
};

exports.getSubscription = function (uuid) {
    return db.executeQuery(`SELECT endpoint, p256, auth
        FROM push_subscriptions WHERE user_uuid = ?`, [uuid]);
};

