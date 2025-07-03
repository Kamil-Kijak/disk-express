
const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();

const connection = require("../utilities/mysqlConection");
const mailTransporter = require("../utilities/MailTransporter")
const checkDataExisting = require("../middlewares/checkDataExisting");

router.post("/request_veryfication", [checkDataExisting(["email", "username"])], async (req, res) => {
        const {email, username} = req.body;
        const veryficationID = nanoid();
        try {
            const [result] = await connection.execute("insert into securitycodes() values(NULL, ?, ?, 0)", [email, veryficationID]);
            // sending email
            const mailOptions ={
                from:process.env.MAIL_USER || "email@gmail.com",
                to:email,
                subject:"Security veryfication",
                html:`
                    <h1 style="text-align:center;margin:3rem;color:green;font-weight:bold">DISK EXPRESS</h1>
                    <h2 style="text-align:center;margin:3rem;font-weight:bold;color:white;">Hello ${username}</h2>
                    <h3 style="text-align:center;margin:3rem;color:white;">You try to log on disk express app using ${email} email.</h3>
                    <h2 style="text-align:center;font-weight:bold;color:green;">To complete two staged verification just click button!</h2>
                    <a href="${process.env.HOST}/security_verification/${veryficationID}"><h3 style="text-align:center;margin:3rem;padding:0.5rem 1rem;background-color:#32cd32;color:white;">Complete verification</h3></a>
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
        } catch(err) {
            return res.status(500).json({error:"Database error"})
        }
    })

router.post("/verify", [checkDataExisting(["code"])], async (req, res) => {
    const {code} = req.body;
    try {
        const [result] = await connection.execute("select COUNT(ID) as count from emailcodes where Code = ?", [code]);
        if(result[0].count == 0) {
            res.status(400).json({error:"Invalid code"})
        } else {
            const [result] = await connection.execute("update emailcodes set Verified = 1 where Code = ?", [code]);
            res.status(200).json({success:true, message:"verification complete"})
        }
    } catch(err) {
        return res.status(500).json({error:"Database error"})
    }
})

module.exports = router;