const jwt = require ("jsonwebtoken")

const sendCookie = (admin = {}, statusCode, res) => {

    const token = jwt.sign(
        {
            id: admin.id
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
        "email": admin.email,
        "roles": admin.roles,
        "id": admin._id,
        "admin_type":admin.admin_type
    }

    res.status(statusCode).cookie('admin_token', token, options).json({
        message: "Success",
        "admin_token": token,
        response,
    });
}

module.exports = sendCookie;