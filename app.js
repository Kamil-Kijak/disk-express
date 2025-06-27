
require("dotenv").config();

const path = require("path")
const cors = require("cors");
const http = require("http");
const express = require("express")
const mysql = require("mysql2");
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const { nanoid } = require("nanoid");

const checkDataExisting = require("./middlewares/checkDataExisting");
const sanitizeData = require("./middlewares/sanitizeData");

const app = express();

app.use(cors());
app.use(express.json());

const mailTransporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.MAIL_USER || "email@gmail.com",
        pass:process.env.MAIL_PASSWORD || "password"
    }
})

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

app.use(sanitizeData);

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
// check username exist
app.post("/api/check_email_free",
     [checkDataExisting(["email"])],
    (req, res) => {
        const {email} = req.body;
        connection.query("select Count(ID) as count from users where email = ?", [email], (err, result) => {
            if(err) {
                return res.status(500).json({error:"Database error"})
            }
            if(result[0].count == 0) {
                res.status(200).json({success:true, message:"email doesn't exist"})
            } else {
                res.status(406).json({error:"This email already exist"})
            }
        })
    });

app.post("/api/request_email_veryfication", [
    checkDataExisting(["email", "username"])],
     (req, res) => {
        const {email, username} = req.body;
        const veryficationID = nanoid();
        // delete old email codes
        connection.query("delete from emailcodes where email = ?", [email], (err, result) => {
            if(err) {
                return res.status(500).json({error:"Database error"})
            }
        })
        connection.query("insert into emailcodes() values(NULL, ?, ?)", [email, veryficationID], (err, result) => {
            if(err) {
                return res.status(500).json({error:"Database error"})
            }
            // sending email
            const mailOptions ={
                from:process.env.MAIL_USER || "email@gmail.com",
                to:email,
                subject:"Email veryfication",
                html:`
                    <h1 style="text-align:center;margin:3rem;color:green;font-weight:bold">DISK EXPRESS</h1>
                    <h2 style="text-align:center;margin:3rem;font-weight:bold;color:white;">Hello ${username}</h2>
                    <h3 style="text-align:center;margin:3rem;color:white;">You try to register on disk express app using ${email} email.</h3>
                    <h2 style="text-align:center;font-weight:bold;color:green;">To verify your email just click on link!</h2>
                    <a href="https://www.youtube.com/"><h3 style="text-align:center;margin:3rem;padding:0.5rem 1rem;background-color:#32cd32;color:white;">Verify you account!</h3></a>
                    <p style="text-align:center;color:white;">This message is generated automatically so don't reply</p>
                    ${veryficationID}
                `
            }
            mailTransporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    return res.status(500).json({error:error})
                }
                return res.status(200).json({success:true, message:"mail send"})
            })
        })
    })
app.post("/api/check_email_veryfication", [checkDataExisting(["email"])], (req, res) => {
    const {email} = req.body;
    connection.query("select COUNT(ID) as count from emailcodes where email = ?", [email], (err, result) => {
        if(err) {
            return res.status(500).json({error:"Database error"})
        }
        if(result[0].count == 0) {
            res.status(200).json({success:true, message:"email veryfied successfully"})
        } else {
            res.status(200).json({success:false, message:"email require veryfication"})
        }
    })
})
// 404 endpoint
app.use((req, res) => {
    res.status(404).end("<h1>404 page not found</h1>")
})

const server = http.createServer(app);
server.listen(process.env.APP_PORT || 3000, () => {
    console.log(`server is running on port ${process.env.APP_PORT || 3000}`)
})