const jwt = require ("jsonwebtoken")
const UserCred = require("../models/user")

const auth = async (req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"secret123")
        console.log(verifyUser)
    }catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;