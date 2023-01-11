const User = require("../models/user")
const Fund = require("../models/fund");
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const nodemailer = require('nodemailer');
const auth = require("../middleware/auth")
const catchAsync = require('../middleware/catchAsync');
const sendCookie = require('../utils/sendCookie');
const sendEmail = require('../utils/sendEmail');
const ErrorHandler = require('../utils/errorHandler');



// Get User Details By Id
exports.getUser = catchAsync(async (req, res, next) => {

    try{
        console.log()
        if(req.params.id != req.user._id){
            res.status(404).json({
              error: "User not found",
              message: "Error"
            }); 
        }
        else{
            const userf = await User.findById(req.params.id)
                            .populate('created_funds','createdAt title long_description _id verification_status images goal currentValue percent withdrawnAmount inProgressAmount')
                            .populate('donated_funds','createdAt title long_description _id verification_status images goal currentValue percent ')
                            .populate('followed_funds','createdAt title long_description _id verification_status images goal currentValue percent ')
            
            const response = {
                "email": userf.email,
                "name": userf.name,
                "lastname": userf.lastname,
                "payment_request": userf.payment_request,
                "paypal_address": userf.paypal_address,
                "followed_funds": userf.followed_funds,
                "created_funds": userf.created_funds,
                "donated_funds": userf.donated_funds,
                "verification_code": userf.verification_code,
                "verification_status": userf.verification_status,
            }
    
            res.status(200).json({
                "message": "Success",
                response,
            });
        }
    }catch(err){
        res.status(404).json({
            error: "Something went wrong",
            message: err.toString()
          }); 
    }    
});

//Updating the user details
exports.updateUser = catchAsync(async (req, res, next) => {

    try{
        const newUserData = req.body;

    
        if(newUserData.email.toString() != req.user.email.toString()){
            res.status(401).json({
              error: "Invalid email",
              message: "Error"
            }); 
        }
        else{
    
            const userf = await User.findByIdAndUpdate(req.user._id, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: true,
            });

            const response = {
                "email": userf.email,
                "payment_request": userf.payment_request,
                "paypal_address": userf.paypal_address,
                "rejected_reason": userf.rejected_reason,
            }
    
            res.status(200).json({
                "message": "Success",
                "user": response,
            });
            
        }    
    }
    catch(err){
        res.status(404).json({
            error: "Something went wrong",
            message: err.toString(),
        }); 
    }
});

exports.DummyLogin= catchAsync(async (req, res, next) => {
    // const fund = await User.findById('636d5ec24e96ef98e64c6e76').populate('created_funds').populate('followed_funds');
    // res.status(200).json({
    //     fund,
    // });
    const category = req.params.category == "all" ? "" : req.params.category;

    console.log(req.params.category)
    const funds =  req.params.category == "all" ? 
                (   
                    await Fund.aggregate(
                        [
                            {
                            $facet : {
                                InProgress : [
                                    { $match : {
                                        $and:[
                                            {"verification_status" : "InProgress" }
                                        ]
                                        } 
                                    },
                                    { $group : { _id : null, count : {$sum : 1} } },
                                ],
                                Approved : [
                                    { $match : {
                                        $and:[
                                            {"verification_status" : "Approved" }
                                        ]
                                        } 
                                    },
                                    { $group : { _id : null, count : {$sum : 1} } },
                                ],
                                Rejected : [
                                    { $match : {
                                        $and:[
                                            {"verification_status" : "Rejected" }
                                        ]
                                        } 
                                    },
                                    { $group : { _id : null, count : {$sum : 1} } },
                                ]
                            }
                            }
                        ]
                    )    
                )
                :
                (
                    await Fund.aggregate(
                        [
                            {
                            $facet : {
                                InProgress : [
                                    { $match : {
                                        $and:[
                                            {"category" : category },
                                            {"verification_status" : "InProgress" }
                                        ]
                                        } 
                                    },
                                    { $group : { _id : null, count : {$sum : 1} } },
                                ],
                                Approved : [
                                    { $match : {
                                        $and:[
                                            {"category" : category },
                                            {"verification_status" : "Approved" }
                                        ]
                                        } 
                                    },
                                    { $group : { _id : null, count : {$sum : 1} } },
                                ],
                                Rejected : [
                                    { $match : {
                                        $and:[
                                            {"category" : category },
                                            {"verification_status" : "Rejected" }
                                        ]
                                        } 
                                    },
                                    { $group : { _id : null, count : {$sum : 1} } },
                                ]
                            }
                            }
                        ]
                    )
                )
            // console.log(JSON.stringify(funds));
            return res.json(funds)


    res.send(`<html><body><h1>Thanks for your order,!</h1></body></html>`);

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log(req.params.id)
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    console.log(session);
    res.send(`<html><body><h1>Thanks for your order, ${session.customer_details.name}!</h1></body></html>`);
    const customer = await stripe.customers.retrieve(session.customer_details);
    

});

//Done
//Follow and Unfollow the fund
exports.followUnfollowPost = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.user._id).select("+followed_funds");

    if (!user) {
        res.status(404).json({
            error: "User not logged in",
            message: "Error",
        });
    }

    const fund = req.params.id;

    if (!fund) {
        res.status(404).json({
            error: "Fund not found",
            message: "Error",
        });
    }

    if (user.followed_funds.includes(req.params.id)) {
        const index = user.followed_funds.indexOf(req.params.id);

        user.followed_funds.splice(index, 1);
        await user.save();

        return res.status(200).json({
            message: "Success",
            status: "Post Unfollowed"
        });
    } else {
        user.followed_funds.push(req.params.id)

        await user.save();

        return res.status(200).json({
            message: "Success",
            status: "Post Followed"
        });
    }
});



















exports.users = (req, res)=>{

    // MySchema.find().sort({ _id: -1 }).limit(2)
  //Count = 21
  
    //console.log("Page: "+req.query.page);
  
    User.find((err, resUsers) => {
      if(err){
        return res.status(400).json({
          error: err
        })
      }
      return res.status(200).json({
        "list": resUsers
      })
    }).sort({ _id: -1 }).limit(1)
  
    var search_text = "6116@gmail";
    var result = User.find({ 'email': { $regex: '^' + search_text, $options: 'i' } });
  
    console.log(result);
  }