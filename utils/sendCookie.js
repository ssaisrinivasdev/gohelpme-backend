const jwt = require ("jsonwebtoken")

const sendCookie = (user = {}, statusCode, res) => {

    const token = jwt.sign(
        {
            id: user.id,  
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    
    const response = {
        "email": user.email,
        "name": user.name,
        "lastname": user.lastname,
        "followed_funds": user.followed_funds,
        "created_funds": user.created_funds,
        "verification_code": user.verification_code,
        "verification_status": user.verification_status,
    }

    res.status(statusCode).cookie('token', token, options).json({
        message: "Success",
        "token": token,
        response,
    });
}

module.exports = sendCookie;