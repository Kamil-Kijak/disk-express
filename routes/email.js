
const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();

const connection = require("../utilities/mysqlConection");
const mailTransporter = require("../utilities/MailTransporter")
const checkDataExisting = require("../middlewares/checkDataExisting");

router.post("/request_veryfication", [
    checkDataExisting(["email", "username"])],
     (req, res) => {
        const {email, username} = req.body;
        const veryficationID = nanoid();
        connection.query("insert into emailcodes() values(NULL, ?, ?, 0)", [email, veryficationID], (err, result) => {
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
                    <a href="${process.env.HOST}/verification/${veryficationID}"><h3 style="text-align:center;margin:3rem;padding:0.5rem 1rem;background-color:#32cd32;color:white;">Verify you account!</h3></a>
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

router.post("/verify", [checkDataExisting(["code"])], (req, res) => {
    const {code} = req.body;
    connection.query("select COUNT(ID) as count from emailcodes where Code = ?", [code], (err, result) => {
        if(err) {
            return res.status(500).json({error:"Database error"})
        }
        if(result[0].count == 0) {
            res.status(404).json({error:"Invalid code"})
        } else {
           connection.query("update emailcodes set Verified = 1 where Code = ?", [code], (err, result) => {
                if(err) {
                    return res.status(500).json({error:"Database error"})
                }
                res.status(200).json({success:true, message:"email verified successfully"})
           })
        }
    })
})

module.exports = router;