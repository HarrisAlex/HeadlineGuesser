const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'dev',
    password: 'password',
    database: 'db'
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to database: ", err.stack);
        return;
    }

    console.log("Connected to database as id: ", db.threadId);
});

module.exports = db;