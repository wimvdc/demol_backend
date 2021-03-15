const db = require("./utils");

exports.insertGroup = function (name, ispublic, adminid) {
    return db.executeQuery(`INSERT INTO groupz
        (name, public, admin_uuid, share_code) VALUES (?,?,?, UUID_SHORT());
    `, [name, ispublic, adminid]);
};

exports.updateGroup = function (uuid, name, ispublic) {
    return db.executeQuery(`UPDATE groupz
        SET name = ?, public = ? WHERE uuid = ?;
    `, [name, ispublic, uuid]);
};

exports.insertUserinGroup = function (groupUuid, userUuid) {
    return db.executeQuery(`INSERT INTO users_in_groupz
        (group_uuid,user_uuid) VALUES (?,?);
    `, [groupUuid, userUuid]);
};

exports.getAllGroups = function () {
    return db.executeQuery(`SELECT name, public,  IF(public = 1, uuid, '') uuid 
        FROM groupz ORDER by name;`);
};

exports.getGroupByUuid = function (uuid) {
    return db.executeQuery(`SELECT name, public, admin_uuid, share_code, uuid FROM groupz 
    WHERE uuid = ?;`, [uuid]);
};

exports.getAdminCount = function (adminid) {
    return db.executeQuery(`SELECT id FROM groupz 
    WHERE admin_uuid = ?;`, [adminid]);
};

exports.getGroupByInviteCode = function (inviteCode) {
    return db.executeQuery(`SELECT uuid FROM groupz 
    WHERE share_code = ?;`, [inviteCode]);
};

exports.getUsersInGroup = function (uuid) {
    return db.executeQuery(`SELECT firstName firstname, UPPER(LEFT (lastName, 1)) lastname, available_points availablepoints FROM users_in_groupz uig, users u 
    WHERE uig.user_uuid = u.uuid and uig.group_uuid = ?;`, [uuid]);
};

exports.getMyGroups = function (userUuid) {
    return db.executeQuery(`SELECT name, uuid FROM groupz WHERE uuid in (
                                SELECT distinct(group_uuid) 
                                FROM users_in_groupz 
                                WHERE user_uuid = ?
                            );`, [userUuid]);
};