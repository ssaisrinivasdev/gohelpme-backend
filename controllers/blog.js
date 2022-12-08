const BlogPost = require("../models/blog")
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const nodemailer = require('nodemailer');
const catchAsync = require("../middleware/catchAsync")

//Done
//Create a single post details by the ID.
exports.createPost = (async (req, res, next)=>{
    try{
      
      const postData = {
        title: req.body.title,
        long_description: req.body.long_description,
      }
  
      const post = await BlogPost.create(postData);
      if(req.files){
        post.images = req.files.map(file => file.location);
      }
      await post.save();
      
      return res.status(201).json({
        message: "Success",
        post
      });
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString()
      }); 
    }
});


exports.getPost = catchAsync(async (req, res, next) => {
    try{
      if(req.params.id != null)
      {
        
        const post = await BlogPost.findById(req.params.id);
  
        return res.status(200).json({
            message: "Success",
            post
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
        message: err.toString()
      }); 
    }  
  });
  