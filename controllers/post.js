const User = require("../models/user")
const Post = require("../models/post");
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const nodemailer = require('nodemailer');
const catchAsync = require("../middleware/catchAsync")
const auth = require("../middleware/auth")
const sendCookie = require('../Utils/sendCookie');

//Done
// Get post Details By Id
exports.getPostDetails = catchAsync(async (req, res, next) => {
  try{
    if(req.params.id != null)
    {
      const post = await Post.findById(req.params.id)

      return res.status(200).json({
          message: "Success",
          post,
      });

    }
    else{
      return res.status(404).json({
        error: "Post not found",
        message: "Error",
      }); 
    }
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err
    }); 
  }  
});

//Done
// Search Posts
exports.searchPosts = catchAsync(async (req, res, next) => {
  try
  {
    var page = req.query.page <= 0 ? 1 : req.query.page;
    var rangeStart = ((page - 1) * 3)+1;

    if(req.query.keyword)
    {
      const posts = await Post.find({
        $and: [{
          $or: [
            {
                title: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            },
            {
                tags: {
                    $regex: req.query.keyword,
                    $options: "i",
                }
            }
          ],
          category: {
            $regex: req.query.category,
            $options: "i",
          }
        }]
      })
      .sort({ _id: -1 })
      .skip(rangeStart)
      .limit(3);
      
      res.status(200).json({
        message: "Success",
        posts,
      });
    }
    return res.status(200).json({
      message: "Success",
      posts: null
    }); 
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err
    }); 
  }
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
exports.addPostUpdates = catchAsync(async (req, res, next) => {

  const {_id } = req.body;

  const newUserData = req.body

  const post = await Post.findOne({_id});
  if (userExists && userExists._id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("User already exists", 404));
  }
  if (email != req.user.email.toString()) {
      return next(new ErrorHandler("Invalid email", 401));
  }

  post.up

  res.status(200).json({
      success: true,
  });
});


//Done
//Create a single post details by the ID.
exports.createPost = (async (req, res, next)=>{
  try{
    const post = await Post.create(req.body);
    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({
        error: "User not found",
        message: "Error"
      }); 
    }
    post.owner = user._id;
    await post.save();
    
    return res.status(201).json({
      message: "Success",
      post
    });
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err
    }); 
  }
})

//Done
//Search Funds
exports.postsByCategory = catchAsync(async (req, res, next) => {
  try{
    var page = req.query.page <= 0 ? 1 : req.query.page;
  
    var rangeStart = ((page - 1) * 3)+1;
    if(req.query.category){
      const posts = await Post.find({
          category: {
            $regex: req.query.category,
            $options: "i",
        }
      })
      .sort({ _id: -1 })
      .skip(rangeStart)
      .limit(3);
      
      return res.status(200).json({
        success: true,
        posts,
      });
    }
    else{
      return res.status(200).json({
        success: true,
        result: null,
      });
    }
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err
    }); 
  }
});


//Done
//Updating the post details
exports.updatePost = catchAsync(async (req, res, next) => {

  try{
    //TODO: check whether post is belongs to the user in the 
    var postFromBody = req.body;
    if(postFromBody.owner == req.user._id){
      await Post.findByIdAndUpdate(req.params.id, postFromBody, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      });
      const postFromId = await Post.findById(req.params.id);
      res.status(200).json({
          message: "Success",
          postFromId
      });
    }
    else{
      return res.status(404).json({
        error: "Invalid post owner",
        message: "Error"
      }); 
    }
  }
  catch(err){
    return res.status(404).json({
      error: "Something went wrong",
      message: err
    }); 
  } 
});