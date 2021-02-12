const mysql = require("mysql");
const { database, databaseUnsafe } = require("../utils/config");
let pool = mysql.createPool(database);
let poolUnsafe = mysql.createPool(databaseUnsafe);

const executeSQL = (statement, input) => {
    return new Promise(function (resolve, reject) {
        pool.query(statement, input, function (error, results) {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

const executeMultipleStatements = (statements, input) => {
    return new Promise(function (resolve, reject) {
        poolUnsafe.query(statements, input, function (error, results) {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

exports.executeQuery = executeSQL;
exports._executeQueries = executeMultipleStatements;
exports.mysqlPool = pool;