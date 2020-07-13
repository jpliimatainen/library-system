const mysql = require('mysql2');
const { dbHost, dbName, dbUser, dbPassword } = require('../config/env.config');

// create a connection pool to the database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbHost,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    dateStrings: true, // return dates as strings
});

// execute a query against the database
const dbQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, function(err, results, fields) {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
};

module.exports = dbQuery;