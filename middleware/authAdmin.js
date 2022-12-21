const jwt = require ("jsonwebtoken")
const Admin = require("../models/admin")
const catchAsync = require("./catchAsync");


exports.isAdminAuthenticated = catchAsync(async (req, res, next) => {
    
    try{
        const { admin_token } = req.cookies;

        if(!admin_token) {
            return res.status(401).json({
                error: "Please Login to Access",
                Message: "Error"
            });
        }

        const decodedData = jwt.verify(admin_token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decodedData.id);

        next();
    }
    catch(err)
    {
        return res.status(401).json({
            error: err
        })
    }
});