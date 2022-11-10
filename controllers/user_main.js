const User = require("../models/user")
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
        if(req.params.id != req.user.id){
            res.status(404).json({
              error: "User not found",
              message: "Error"
            }); 
        }
        else{
            const user = await User.findById(req.params.id)
    
            const response = {
                "email": user.email,
                "name": user.name,
                "lastname": user.lastname,
                "followed_posts": user.followed_posts,
                "created_posts": user.created_posts,
                "verification_code": user.verification_code
            }
    
            res.status(200).json({
                "message": "Success",
                response,
            });
        }
    }catch(err){
        res.status(404).json({
            error: "User not found",
            message: err
          }); 
    }    
});

//Updating the user details
exports.updateUser = catchAsync(async (req, res, next) => {

    try{
        const { name, lastname, email } = req.body;

        const newUserData = {
            name,
            lastname,
            email,
        }
    
        if(email != req.user.email.toString()){
            res.status(401).json({
              error: "Invalid email",
              message: "Error"
            }); 
        }
        else{
    
            await User.findByIdAndUpdate(req.user._id, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: true,
            });
    
            res.status(200).json({
                "message": "Success",
            });
            
        }    
    }
    catch(err){
        res.status(404).json({
            error: "Something went wrong",
            message: err
        }); 
    }
});

exports.DummyLogin= catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
    });
});

//Not Done
//Follow and Unfollow the post
exports.updateFollowStatus = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.user._id).select("+followed_posts");

    const postId = req.query.post;

    const index = user.followed_posts.indexOf(postId);
    if (index > -1) {
        user.followed_posts.splice(index, 1);
    }
    else{
        user.followed_posts.push(postId);
    }
    
    await user.save();

    res.status(200).json({
        success: true,
        user,
    });
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