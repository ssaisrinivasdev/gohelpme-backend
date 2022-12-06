const User = require("../models/user")
const Fund = require("../models/fund");
const Donations = require("../models/donation")
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const nodemailer = require('nodemailer');
const catchAsync = require("../middleware/catchAsync")
const auth = require("../middleware/auth")
const sendCookie = require('../utils/sendCookie');


//Done
// Get post Details By Id
exports.getFundDetails = catchAsync(async (req, res, next) => {
  try{
    if(req.params.id != null)
    {
      var following_status = "not_following";
      try{
        console.log("started")
        const { token } = req.cookies;
        if(!token) 
        {
          following_status = "not_loggedin"
        }
        else
        {
          const decodedData = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decodedData.id);
          if(!user)
          {
            following_status = user
          }
          else if(user.followed_funds?.includes(req.params.id))
          {
            following_status = "following"
          }
          else
          {
            following_status = "not_following"
          }
        }
      }catch(err){
        following_status = err.toString()
      }


      const fund = await Fund.findById(req.params.id).populate('donations', 'donator_name amount time payment_status');

      return res.status(200).json({
          message: "Success",
          fund,
          following_status
      });

    }
    else{
      return res.status(404).json({
        error: "Fund not found",
        message: "Error",
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

//Done
// Search Funds
exports.searchFunds = catchAsync(async (req, res, next) => {
  try
  {
    var page = req.query.page <= 0 ? 1 : req.query.page;
    var rangeStart = ((page - 1) * 6)+1;
    const category = req.query.category == null ? "" : new RegExp(req.query.category,"i");
    const keyword = new RegExp(req.query.keyword,"i");

    const fundCount = await Fund.aggregate([
      { 
        $facet : {
          metaInfo : [
            { $match : {
                        $and: [
                          {$or:[{ "title" : keyword }, { "tags" : keyword }]},
                          {"category": category}
                       ]}
            },
            { $group : { _id : null, count : {$sum : 1} } }
          ],
          actualData : [
            { $match : {
                        $and: [
                          {$or:[{ "title" : keyword }, { "tags" : keyword }]},
                          {"category": category}
                      ]}},
            { $skip  : rangeStart-1 },
            { $limit : 6 },
            {$sort: {_id: -1}}
          ]
        }
      }
    ]);
    const totalresultsfound = fundCount[0]?.metaInfo[0]?.count == null ? 0 : fundCount[0]?.metaInfo[0]?.count;
      
    return res.status(200).json({
      message: "Success",
      results: totalresultsfound,
      current: parseInt(page),
      pages: totalresultsfound==null ? 0 : (Math.ceil(totalresultsfound/6)),
      "funds": fundCount[0]?.actualData == null ? '[]' : fundCount[0]?.actualData
    });

  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  }
});


exports.getTrendingFunds= catchAsync(async (req, res, next) => {
  const funds = await Donations.aggregate([
    { 
      $facet : {
        donations : [
          { $match: { "time": { $gt: new Date(Date.now() - 24*60*60 * 1000*7) } } },
          {
            $group:{
              _id:"$fund_id",
              "amount": {
                $sum: "$amount"
              },
              "donation_count": { $sum : 1 }
            }
          },
          {
            $lookup:{
              from: "fundposts",
              localField: "_id",
              foreignField: "_id",
              as: "funds"
            }
          },
          { $sort : { donation_count : -1, amount: -1} }
        ]
      }
    }
  ]);

   return res.status(200).json({
      message: "Success",
      funds
    });

});


//Create Public API to get All fund posts
exports.getAllFunds = (req, res)=>{

  // MySchema.find().sort({ _id: -1 }).limit(2)
  //Count = 21
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
}

//Updating the user details
exports.addFundUpdates = catchAsync(async (req, res, next) => {

  const {_id } = req.body;

  const newUserData = req.body

  const fund = await Fund.findOne({_id});
  if (userExists && userExists._id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("User already exists", 404));
  }
  if (email != req.user.email.toString()) {
      return next(new ErrorHandler("Invalid email", 401));
  }

  //fund.up

  res.status(200).json({
      success: true,
  });
});


//Done
//Create a single post details by the ID.
exports.createFund = (async (req, res, next)=>{
  try{
    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({
        error: "User not found",
        message: "Error"
      }); 
    }
    const fundData = {
      owner: user._id,
      title: req.body.title,
      long_description: req.body.long_description,
      fund_verified_documents: req.body.fund_verified_documents,
      curreny: req.body.currency,
      isverified_status: false,
      fund_type: req.body.fund_type,
      category: req.body.category,
      donations: req.body.donations,
      curreny: req.body.currency,
      goal: req.body.goal,
      currentValue: req.body.currentValue,
      percent: req.body.percent,
      totalDonationsCount: req.body.totalDonationsCount,
      phone: req.body.phone,
      Address: req.body.Address,
      Country: req.body.Country,
      Zip_code: req.body.Zip_code,
      city: req.body.city,
      tags: req.body.tags
    }

    const fund = await Fund.create(fundData);
    if(req.files){
      fund.images = req.files.map(file => file.location);
    }
    await fund.save();

    user.created_funds.push(fund._id);
    
    await user.save();
    
    return res.status(201).json({
      message: "Success",
      fund
    });
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString()
    }); 
  }
});

//Done
//TODO: Add get all funds
//Search Funds
exports.fundsByCategory = catchAsync(async (req, res, next) => {
  try{
    var page = (req.query.page == null ? 0 : req.query.page) <= 0 ? 1 : req.query.page;
  
    var rangeStart = ((page - 1) * 6)+1;
    // if(req.query.category){
      const funds = await Fund.find({
          category: {
            $regex: req.query.category == null ? "": req.query.category,
            $options: "i",
        }
      })
      .sort({ _id: -1 })
      .skip(rangeStart-1)
      .limit(6);
      
      return res.status(200).json({
        success: true,
        funds,
      });
    // }
    // else{
    //   return res.status(200).json({
    //     success: true,
    //     result: null,
    //   });
    // }
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  }
});




//Done


//Done
//Updating the post details
exports.updateFund = catchAsync(async (req, res, next) => {

  try{
    //TODO: check whether post is belongs to the user in the 
    var fundFromBody = req.body;
    if(fundFromBody.owner == req.user._id){
      await Fund.findByIdAndUpdate(req.params.id, fundFromBody, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      });
      const fundFromId = await Fund.findById(req.params.id);
      res.status(200).json({
          message: "Success",
          fundFromId
      });
    }
    else{
      return res.status(404).json({
        error: "Invalid fund owner",
        message: "Error",
        "ownerFromRequest" : fundFromBody,
        "ownerFromBrowser": req.user._id
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