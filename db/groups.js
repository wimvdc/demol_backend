const db = require("./utils");

exports.insertGroup = (name, ispublic, adminid) => {
    return db.executeQuery(`INSERT INTO groupz
        (name, public, admin_uuid, share_code) VALUES (?,?,?, UUID_SHORT());
    `, [name, ispublic, adminid]);
};

exports.updateGroup = (uuid, name, ispublic) => {
    return db.executeQuery(`UPDATE groupz
        SET name = ?, public = ? WHERE uuid = ?;
    `, [name, ispublic, uuid]);
};

exports.insertUserinGroup = (groupUuid, userUuid) => {
    return db.executeQuery(`INSERT INTO users_in_groupz
        (group_uuid,user_uuid) VALUES (?,?);
    `, [groupUuid, userUuid]);
};

exports.getAllGroups = (userUuid) => {
    //return db.executeQuery(`SELECT name, public,  IF(public = 1, uuid, ''), uuid 
    //    FROM groupz ORDER by name;`);
    return db.executeQuery(`SELECT 'Publieke groep' name, (SELECT COUNT(*) FROM users) members, 'public' uuid
                            UNION
                            SELECT name, 
                            (SELECT COUNT(id) FROM users_in_groupz u WHERE uuid = group_uuid) members, 
                            (SELECT group_uuid FROM users_in_groupz WHERE uuid = group_uuid and user_uuid = ?) uuid
                            FROM groupz ORDER BY members desc;`, [userUuid]);

};

exports.getGroupByUuid = (uuid) => {
    return db.executeQuery(`SELECT name, uuid FROM groupz 
    WHERE uuid = ?;`, [uuid]);
};

exports.getAdminCount = (adminid) => {
    return db.executeQuery(`SELECT id FROM groupz 
    WHERE admin_uuid = ?;`, [adminid]);
};

exports.getGroupByInviteCode = (inviteCode) => {
    return db.executeQuery(`SELECT uuid FROM groupz 
    WHERE share_code = ?;`, [inviteCode]);
};

exports.getUsersInGroup = (uuid) => {
    return db.executeQuery(`SELECT IF(ISNULL(nickname), CONCAT(firstName," ",UPPER(LEFT (lastName, 1))), nickname)  nickname, available_points availablepoints FROM users_in_groupz uig, users u
    WHERE uig.user_uuid = u.uuid and uig.group_uuid = ?
    ORDER BY available_points desc;`, [uuid]);
};

exports.getAllPublicUsers = () => {
    return db.executeQuery(`SELECT IF(ISNULL(nickname), CONCAT(firstName," ",UPPER(LEFT (lastName, 1))), nickname)  nickname, 
                                   available_points availablepoints, DENSE_RANK() OVER (ORDER BY available_points DESC) AS ranking 
    FROM users u WHERE isPublic = 1
    ORDER BY available_points desc;`);
};

exports.getMyGroups = (userUuid) => {
    return db.executeQuery(`SELECT name, uuid FROM groupz WHERE uuid in (
                                SELECT distinct(group_uuid) 
                                FROM users_in_groupz 
                                WHERE user_uuid = ?
                            );`, [userUuid]);
};