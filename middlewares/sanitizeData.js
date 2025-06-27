
const validator = require("validator")
const sanitizeData = (req, res, next) => {
    const body = req.body;
    const newBody = {}
     Object.keys(body).forEach((key) =>{
        newBody[key] = validator.escape(body[key]);
    })
    req.body = newBody;
    next();
}

module.exports = sanitizeData;