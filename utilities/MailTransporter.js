const nodemailer = require("nodemailer")
const mailTransporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.MAIL_USER || "email@gmail.com",
        pass:process.env.MAIL_PASSWORD || "password"
    }
})

module.exports = mailTransporter;