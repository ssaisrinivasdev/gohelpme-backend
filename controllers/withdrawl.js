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
      if(!fund && fund.fund_type != "Charity"){
        return res.status(404).json({
          error: "Fund not found",
          message: "Error"
        }); 
      }

      const requestData = {
        owner: user._id,
        fund: req.body.fund_id,
        current_amount: req.body.current_amount,
        withdrawl_amount: req.body.withdrawl_amount,
      }

      if(requestData.withdrawl_amount > 500){
        const isWithdrawalble = requestData.current_amount >= requestData.withdrawl_amount

        if(isWithdrawalble){
          const wdReq = await Withdrawl.create(requestData);
        
          const temp = fund.withdrawnAmount + requestData.withdrawl_amount
          fund.withdrawnAmount = temp
          fund.inProgressAmount = fund.withdrawnAmount
          fund.withdrawls = wdReq._id;
          await fund.save();
          
          return res.status(201).json({
            message: "Success",
            wdReq
          });
        }else{
          return res.status(400).json({
            error: "Insufficient Funds",
            message: "Error"
          }); 
        }
      }
      else{
        return res.status(400).json({
          error: "Minimum withdrawal amount must be 10usd",
          message: "Error"
        }); 
      }
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

        if(requestFromBody){
          const status = req.body.withdrawl_status

          const wdReqr = await Withdrawl.findById(req.params.id)
          if(!wdReqr){
            return res.status(404).json({
              error: "Request not found",
              message: "Error"
            }); 
          }

          const fund = await Fund.findById(wdReqr.fund);
          if(!fund){
            return res.status(404).json({
              error: "Fund not found",
              message: "Error"  
            });
          }

          if(status == "Rejected"){
            fund.withdrawnAmount = fund.inProgressAmount - fund.withdrawnAmount
            fund.inProgressAmount = 0
          }else if(status == "Approved"){
            fund.inProgressAmount = 0
          }

          await Withdrawl.findByIdAndUpdate(req.params.id, requestFromBody, {
            new: true,
            runValidators: true,
            useFindAndModify: true,
          });
          
          fund.save();
          const wdReq = await Withdrawl.findById(req.params.id)
                                  .populate('owner','createdAt title long_description _id verification_status images goal currentValue percent ')
                                  .populate('fund','createdAt title long_description _id verification_status images goal currentValue percent ')
                  
          const withdrawl_details = {
              "payment_status": wdReq.payment_status,
              "withdrawl_amount": wdReq.withdrawl_amount,
              "withdrawl_status": wdReq.withdrawl_status,
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

exports.RequestsForFund = catchAsync(async (req, res, next) => {
  try{
      if(!req.params.fundId){
          res.status(404).json({
            error: "Fund Not Found",
            message: "Error"
          }); 
      }
      const fund = await Fund.findById(req.params.fundId);
      console.log(fund._id)
      if(!fund){
        return res.status(404).json({
          error: "Fund not found",
          message: "Error"
        }); 
      }
      else{
          const wdReq =  await Withdrawl.aggregate(
            [
                {
                    $facet : {
                        Result : [
                            { $match : {
                                $and:[
                                    { "fund" : fund._id }
                                ]
                                }
                            },
                                {$project:{
                                    "_id":1,
                                    "fund":1,
                                    "createdAt":1,
                                    "owner":1,
                                    "withdrawl_status":1,
                                    "withdrawl_amount":1,
                                    "rejected_reason":1,
                                }
                            }
                        ]
                    }
                }
            ]
        )
  
          res.status(200).json({
              "message": "Success",
              "response": wdReq[0]?.Result,
          });
      }
  }catch(err){
      res.status(404).json({
          error: "Something went wrong",
          message: err.toString()
        }); 
  }    
});


exports.createAndAcceptCharityRequest = catchAsync(async (req, res, next)=>{
  try{
    
    console.log("InCharity")

    const fund = await Fund.findById(req.params.fund_id);
    if(!fund){
      return res.status(404).json({
        error: "Fund not found",
        message: "Error"
      }); 
    }

    const requestData = {
      owner: fund.owner,
      fund: fund._id,
      current_amount: fund.currentValue,  
      withdrawl_amount: (fund.currentValue) - (fund.withdrawnAmount),
    }

    if(requestData.withdrawl_amount > 10){
      const isWithdrawalble = requestData.current_amount >= requestData.withdrawl_amount

      if(isWithdrawalble){
        const wdReq = await Withdrawl.create(requestData);
      
        const temp = fund.withdrawnAmount + requestData.withdrawl_amount
        fund.withdrawnAmount = temp
        fund.inProgressAmount = fund.withdrawnAmount
        fund.withdrawls = wdReq._id;
        await fund.save();
        
        const requestFromBody = {
          withdrawl_status: "Approved",
          rejected_reason: "NA"
        }

        fund.inProgressAmount = 0

        await Withdrawl.findByIdAndUpdate(wdReq._id, requestFromBody, {
          new: true,
          runValidators: true,
          useFindAndModify: true,
        });
          
        fund.save();

        wdReq = await Withdrawl.findById(wdReq._id)
                                  .populate('owner','createdAt title long_description _id verification_status images goal currentValue percent ')
                                  .populate('fund','createdAt title long_description _id verification_status images goal currentValue percent ')
                  
        const withdrawl_details = {
            "payment_status": wdReq.payment_status,
            "withdrawl_amount": wdReq.withdrawl_amount,
            "withdrawl_status": wdReq.withdrawl_status,
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
      }else{
        return res.status(400).json({
          error: "Insufficient Funds",
          message: "Error"
        }); 
      }
    }
    else{
      return res.status(400).json({
        error: "Minimum withdrawal amount must be 10usd",
        message: "Error"
      }); 
    }
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString()
    }); 
  }
});