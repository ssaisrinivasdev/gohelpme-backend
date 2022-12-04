const Query = require("../models/queries")
const catchAsync = require("../middleware/catchAsync");

exports.query = catchAsync(async (req, res, next) => {
    try{
        const query = await Query.create(req.body);
        return res.status(200).json({
            message: "Success",
            query
        });
    }
    catch(err){
        return res.status(400).json({
          error: "Something went wrong",
          message: err.toString()
        }); 
    }  
});