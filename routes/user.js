
const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const connection = require("../utilities/mysqlConection");
const checkDataExisting = require("../middlewares/checkDataExisting");

// check email exist
router.post("/check_free", [checkDataExisting(["email"])], async (req, res) => {
        const {email} = req.body;
        try {
            const [result] = await connection.execute("select Count(ID) as count from users where email = ?", [email])
            if(result[0].count == 0) {
                res.status(200).json({success:true, message:"email doesn't exist"})
            } else {
                res.status(406).json({error:"This email already exist"})
            }
        } catch(err) {
            return res.status(500).json({error:"Database error"})
        }
    });


router.post("/register", [checkDataExisting(['email', 'username', 'password', 'name', 'surname', 'country'])], async (req, res) => {
    const {email, username, password, name, surname, country} = req.body;
    // check if this email doesnt exist
    try {
        const [result] = await connection.execute("select Count(ID) as count from users where email = ?", [email]);
        if(result[0].count == 0) {
            const [result] = await connection.execute("select COUNT(ID) as count from emailcodes where Email = ? and Verified = 1", [email]);
            if(result[0].count > 0) {
                const serialNumber = nanoid();
                await connection.execute("insert into users() values(NULL, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, DEFAULT, DEFAULT, NULL)", [serialNumber, email, crypto.createHash("md5").update(password).digest("hex"), username, name, surname, country]);
                // deleting old emailcodes
                connection.query("delete from emailcodes where email = ?", [email], (err, result) => {
                    if(err) {
                        return res.status(500).json({error:"Database error"})
                    }
                })
                // creating new token
                const refreshToken = jwt.sign({serial:serialNumber, username:username}, process.env.REFRESH_TOKEN_KEY, {
                    expiresIn:"7d",
                })
                res.cookie("REFRESH_TOKEN", refreshToken, {
                    maxAge:1000 * 60 * 60 * 24 * 7,
                    httpOnly:true,
                    secure:false
                })
                res.status(200).json({success:true, message:"new user registered", user:{serialNumber:serialNumber, username:username}})
            } else {
                return res.status(400).json({requireVerification:true,error:"Email is not verificated"})
            }
        } else {
            return res.status(406).json({error:"This email already exist"})
        }
    } catch (err) {
        return res.status(500).json({error:"Database error"})
    }
});

router.post("/check_email_exist", [checkDataExisting(["email"])], async (req, res) => {
        const {email} = req.body;
        try {
            const [result] = await connection.execute("select Count(ID) as count from users where email = ?")
            if(result[0].count > 0) {
                res.status(200).json({success:true, message:"email exist"})
            } else {
                res.status(406).json({error:"This email doesn't exist"})
            }
        } catch (err) {
            return res.status(500).json({error:"Database error"})
        }
    });

router.post("/login", [checkDataExisting(["email", "password"])], async (req, res) => {
    const {email, password} = req.body;
    try {
        const [result] = await connection.execute("select COUNT(ID) as count from users where email = ?", [email]);
        if(result[0].count == 0) {
            res.status(400).json({error:"This email adress doesn't exist"})
        } else {
            const [result] = await connection.execute("select SerialNumber, Username, DoubleVerification from users where email = ? and password = ?", [email, crypto.createHash("md5").update(password).digest("hex")]);
            if(result.length == 0) {
                res.status(400).json({error:"Invalid password"})
            } else {
                let successLogin = false;
                if(result[0].DoubleVerification == 1) {
                    const [result] = await connection.execute("select COUNT(ID) as count from securitycodes where Email = ? and Verified = 1", [email])
                    if(result[0].count >= 0) {
                        await connection.execute("delete from securitycodes where email = ?", [email]);
                        successLogin = true;
                    }
                } else {
                    successLogin = true;
                }
                if(successLogin) {
                    // creating new token
                    const refreshToken = jwt.sign({serial:result[0].serialNumber, username:result[0].username}, process.env.REFRESH_TOKEN_KEY, {
                        expiresIn:"7d",
                    })
                    res.cookie("REFRESH_TOKEN", refreshToken, {
                        maxAge:1000 * 60 * 60 * 24 * 7,
                        httpOnly:true,
                        secure:false
                    })
                    res.status(200).json({success:true, message:"successfully user login", user:{
                        serialNumber:result[0].serialNumber, username:result[0].username
                    }})
                } else {
                    res.status(400).json({requireVerification:true,error:"failed to login"})
                }
            }
        }
    } catch (err) {
        return res.status(500).json({error:"Database error"})
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("ACCESS_TOKEN");
    res.clearCookie("REFRESH_TOKEN");
    res.status(200).json({success:true, message:"logout successfully"})
})

module.exports = router;