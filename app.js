
require("dotenv").config();

const path = require("path")
const cors = require("cors");
const http = require("http");
const express = require("express")
const mysql = require("mysql2");
const crypto = require("crypto")
const { nanoid } = require("nanoid");

const checkDataExisting = require("./middlewares/checkDataExisting");

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host:"localhost",
    user:process.env.DB_USER || "root",
    password:process.env.DB_PASSWORD || "",
    database:process.env.DB_NAME || "disk_express_database"
});

connection.connect((err) => {
    if(err) {
        console.error("connection error", err);
        return;
    }
    console.log("DB connected successfully");
})

if(process.env.STATIC_HOST == 1) {
    app.use(express.static(path.join(__dirname, "app", "dist")))
}

app.get("/", (req, res) => {
    res.redirect("/api")
})

// register
app.post("/api/register", [
    checkDataExisting(['email', 'username', 'password', 'name', 'surname', 'country'])
], (req, res) => {
    const {email, username, password, name, surname, country} = req.body;
    // check if this email doesnt exist
    connection.query("select Count(ID) as count from users where email = ?", [email], (err, result) => {
        if(err) {
            return res.status(500).json({error:"Database error"})
        }
        if(result[0].count == 0) {
            // this email doesnt exist
            connection.query("insert into users() values(NULL, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, DEFAULT, DEFAULT, NULL)",
                 [nanoid(), email, crypto.createHash("md5").update(password).digest("hex"), username, name, surname, country],
                  (err, result) => {
                    if(err) {
                        return res.status(500).json({error:"Database error"})
                    }
                    res.status(200).json({success:true, message:"new user registered"})
                 })
        } else {
            return res.status(406).json({error:"This email already exist"})
        }
    })
});



// 404 endpoint
app.use((req, res) => {
    res.status(404).end("<h1>404 page not found</h1>")
})

const server = http.createServer(app);
server.listen(process.env.APP_PORT || 3000, () => {
    console.log(`server is running on port ${process.env.APP_PORT || 3000}`)
})