
const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const connection = require("../utilities/mysqlConection");
const checkDataExisting = require("../middlewares/checkDataExisting");

// check email exist
router.post("/check_free",
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


router.post("/register", [
    checkDataExisting(['email', 'username', 'password', 'name', 'surname', 'country'])
], (req, res) => {
    const {email, username, password, name, surname, country} = req.body;
    // check if this email doesnt exist
    connection.query("select Count(ID) as count from users where email = ?", [email], (err, result) => {
        if(err) {
            return res.status(500).json({error:"Database error"})
        }
        if(result[0].count == 0) {
            connection.query("select COUNT(ID) as count from emailcodes where Email = ? and Verified = 1", [email], (err, result) => {
                if(err) {
                    return res.status(500).json({error:"Database error"})
                }
                if(result[0].count > 0) {
                    const serialNumber = nanoid();
                    connection.query("insert into users() values(NULL, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, DEFAULT, DEFAULT, NULL)",
                         [serialNumber, email, crypto.createHash("md5").update(password).digest("hex"), username, name, surname, country],
                          (err, result) => {
                            if(err) {
                                return res.status(500).json({error:"Database error"})
                            }
                            // deleting old emailcodes
                            connection.query("delete from emailcodes where email = ?", [email], (err, result) => {
                                if(err) {
                                    return res.status(500).json({error:"Database error"})
                                }
                            })
                            res.status(200).json({success:true, message:"new user registered"})
                         })
                } else {
                    return res.status(400).json({error:"Email is not verificated"})
                }
            })
        } else {
            return res.status(406).json({error:"This email already exist"})
        }
    })
});

router.post("/login", [checkDataExisting(["email", "password"])], (req, res) => {
    const {email, password} = req.body;
    connection.query("select COUNT(ID) as count from users where email = ?", [email], (err, result) => {
        if(err) {
            return res.status(500).json({error:"Database error"})
        }
        if(result[0].count == 0) {
            res.status(400).json({error:"This email adress doesn't exist"})
        } else {
            connection.query("select SerialNumber, Username, DoubleVerification from users where email = ? and password = ?",
                 [email, crypto.createHash("md5").update(password).digest("hex")], (err, result) => {
                    if(err) {
                        return res.status(500).json({error:"Database error"})
                    }
                    if(result.length == 0) {
                        res.status(400).json({error:"Invalid password"})
                    } else {
                        if(result[0].DoubleVerification == 1) {

                        } else {
                            // creating new token
                            const refreshToken = jwt.sign({serial:serialNumber, username:username}, process.env.REFRESH_TOKEN_KEY, {
                                expiresIn:"7d",
                            })
                            res.cookie("REFRESH_TOKEN", refreshToken, {
                                maxAge:1000 * 60 * 60 * 24 * 7,
                                httpOnly:true,
                                secure:false
                            })
                        }
                        res.status(200).json({success:true, message:"successfully user login"})
                    }
                 })
        }
    })
})

module.exports = router;