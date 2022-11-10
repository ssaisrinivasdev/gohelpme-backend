const jwt = require ("jsonwebtoken")
const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("./catchAsync");


exports.isAuthenticated = catchAsync(async (req, res, next) => {
    
    try{
        const { token } = req.cookies;

        if(!token) {
            return res.status(401).json({
                error: "Please Login to Access",
                Message: "Error"
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);

        next();
    }
    catch(err)
    {
        return res.status(401).json({
            error: "Please Login to Access"
        })
    }
});