
const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host:process.env.DB_HOST || "localhost",
    user:process.env.DB_USER || "root",
    password:process.env.DB_PASSWORD || "",
    database:process.env.DB_NAME || "disk-express"
});

const testConnection = async () => {
     try {
        const conn = await pool.getConnection();
        await conn.ping();
        console.log("Connection with mysql service succeed");
        conn.release();
    } catch (err) {
        console.error("Error with connection with mysql service: ", err.code);
        process.exit(1);
    }
}
testConnection();

module.exports = pool;