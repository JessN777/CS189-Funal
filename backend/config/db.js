const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.SQL_PASSWORD,
    database: 'RecipeDB',
});

module.exports = db;
