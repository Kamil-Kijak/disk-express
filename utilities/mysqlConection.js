
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"localhost",
    user:process.env.DB_USER || "root",
    password:process.env.DB_PASSWORD || "",
    database:process.env.DB_NAME || "disk_express_database"
});

connection.connect((err) => {
    if(err) {
        console.error("connection error", err);
        process.abort();
    }
    console.log("DB connected successfully");
})

module.exports = connection;