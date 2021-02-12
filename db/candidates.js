const db = require("./utils")

exports.getAllCandidates = function () {
    return db.executeQuery(`SELECT * FROM candidates ORDER BY isout, name;`);
};

exports.getAllActiveCandidates = function () {
    return db.executeQuery(`SELECT * FROM candidates where isOut = 0 ORDER BY name;`);
};