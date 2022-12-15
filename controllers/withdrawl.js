const User = require("../models/user")
const Fund = require("../models/fund");
const Withdrawl = require("../models/withdrawl");
const catchAsync = require('../middleware/catchAsync');


exports.createRequest = catchAsync(async (req, res, next)=>{
    try{
      const user = await User.findById(req.user._id);
      if(!user){
        return res.status(404).json({
          error: "User not found",
          message: "Error"
        }); 
      }
      const fund = await Fund.findById(req.body.fund_id);
      if(!fund){
        return res.status(404).json({
          error: "Fund not found",
          message: "Error"
        }); 
      }

      const requestData = {
        owner: user._id,
        fund: req.body.fund_id,
        withdrawl_amount: req.body.withdrawl_amount,
      }
  
      const wdReq = await Withdrawl.create(requestData);
      
      fund.withdrawls = wdReq._id;
      await fund.save();
      
      return res.status(201).json({
        message: "Success",
        wdReq
      });
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString()
      }); 
    }
  });

exports.updateRequest = catchAsync(async (req, res, next) => {

  try{
    //TODO: check whether post is belongs to the user in the 
        var requestFromBody = req.body;

        await Withdrawl.findByIdAndUpdate(req.params.id, requestFromBody, {
            new: true,
            runValidators: true,
            useFindAndModify: true,
        });
        const wdReq = await Withdrawl.findById(req.params.id)
                                .populate('owner','createdAt title long_description _id verification_status images goal currentValue percent ')
                                .populate('fund','createdAt title long_description _id verification_status images goal currentValue percent ')
                
        const withdrawl_details = {
            "payment_status": wdReq.payment_status,
            "withdrawl_amount": wdReq.withdrawl_amount,
            "rejected_reason": wdReq.rejected_reason,
            "payment_type": wdReq.payment_type,
            "createdAt": wdReq.createdAt,
            "user": wdReq.owner,
            "fund": wdReq.fund,
            //TODO: Add owner and fund details manually only required.
        }
        
        res.status(200).json({
            "message": "Success",
            withdrawl_details,
        });
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  } 
});

exports.getRequest = catchAsync(async (req, res, next) => {

    try{
        console.log(req.params.id)
        if(!req.params.id){
            res.status(404).json({
              error: "Withdrawl Request Not Found",
              message: "Error"
            }); 
        }
        else{
            const wdReq = await Withdrawl.findById(req.params.id)
                            .populate('owner','createdAt title long_description _id verification_status images goal currentValue percent ')
                            .populate('fund','createdAt title long_description _id verification_status images goal currentValue percent ')
            
            const withdrawl_details = {
                "payment_status": wdReq.payment_status,
                "withdrawl_amount": wdReq.withdrawl_amount,
                "rejected_reason": wdReq.rejected_reason,
                "payment_type": wdReq.payment_type,
                "createdAt": wdReq.createdAt,
                "user": wdReq.owner,
                "fund": wdReq.fund,
                //TODO: Add owner and fund details manually only required.
            }
    
            res.status(200).json({
                "message": "Success",
                withdrawl_details,
            });
        }
    }catch(err){
        res.status(404).json({
            error: "Something went wrong",
            message: err.toString()
          }); 
    }    
});