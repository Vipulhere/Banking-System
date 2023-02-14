const jwt = require('jsonwebtoken');

module.exports = function (req,res,next) {
     try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "12345");
        req.body.userid = decoded.userid
        next();
     }
     catch(error){
        res.send({
            message: error.message,
            success: false,
        })
     }
}