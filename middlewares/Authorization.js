const jwt = require("jsonwebtoken")


const authorization = () => {

    const CreateAccessToken = (req, res, next) => {
        if(req.cookies["REFRESH_TOKEN"]) {
            try {
                const decoded = jwt.verify(req.cookies["REFRESH_TOKEN"], process.env.REFRESH_TOKEN_KEY)
                const accessToken = jwt.sign(decoded, process.env.ACCESS_TOKEN_KEY, {
                    expiresIn:"15m"
                })
                res.cookie("ACCESS_TOKEN", accessToken, {
                                maxAge:1000 * 60 * 15,
                                httpOnly:true,
                                secure:false
                            })
                req.user = decoded;
                next()
            } catch(err) {
                res.status(403).json({error:"authorization failed",forbidden:true})
            }
        } else {
            res.status(403).json({error:"authorization failed",forbidden:true})
        }
    }

    return (req, res, next) => {
        if(req.cookies["ACCESS_TOKEN"]) {
            try{
                const decoded = jwt.verify(req.cookies["ACCESS_TOKEN"], process.env.ACCESS_TOKEN_KEY)
                req.user = decoded;
                next();
            } catch(err) {
                CreateAccessToken(req, res, next)
            }
        } else {
            CreateAccessToken(req, res, next)
        }
    }
}
module.exports = authorization;