const Query = require("../models/queries")
const catchAsync = require("../middleware/catchAsync");

exports.createQuery = catchAsync(async (req, res, next) => {
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

exports.updateQuery = catchAsync(async (req, res, next) => {

    try{
          var requestFromBody = req.body;
  
          await Query.findByIdAndUpdate(req.params.id, requestFromBody, {
              new: true,
              runValidators: true,
              useFindAndModify: true,
          });
          const queryReq = await Query.findById(req.params.id)
                                  
          const queryRequest = {
              "full_name": queryReq.full_name,
              "email": queryReq.email,
              "message": queryReq.message,
              "ticket_status": queryReq.ticket_status,
          }
          
          res.status(200).json({
              "message": "Success",
              queryRequest,
          });
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
      }); 
    } 
});

exports.getQuery = catchAsync(async (req, res, next) => {

    try{
        console.log(req.params.id)
        if(!req.params.id){
            res.status(404).json({
              error: "Query Request Not Found",
              message: "Error"
            }); 
        }
        else{
            const queryReq = await Query.findById(req.params.id)
                            
            
            const queryRequest = {
                "full_name": queryReq.full_name,
                "email": queryReq.email,
                "message": queryReq.message,
                "ticket_status": queryReq.ticket_status,
            }
    
            res.status(200).json({
                "message": "Success",
                queryRequest,
            });
        }
    }catch(err){
        res.status(404).json({
            error: "Something went wrong",
            message: err.toString()
          }); 
    }    
});