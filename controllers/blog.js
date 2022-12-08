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

  //Search Funds
exports.getAllPosts = catchAsync(async (req, res, next) => {
    try{
        var page = (req.query.page == null ? 0 : req.query.page) <= 0 ? 1 : req.query.page;
    
        var rangeStart = ((page - 1) * 6)+1;
        // if(req.query.category){
        const posts = await BlogPost.aggregate([
            { 
                $facet : {
                    metaInfo : [
                        { $group : { _id : null, count : {$sum : 1} } }
                    ],
                    actualData : [
                        { $skip  : rangeStart-1 },
                        { $limit : 6 },
                        { $sort: {_id: -1}}
                    ]
                }
            }
        ]);
        const totalResultsFound = posts[0]?.metaInfo[0]?.count == null ? 0 : posts[0]?.metaInfo[0]?.count;
        
        return res.status(200).json({
          success: true,
          "current":page,
          "posts": posts[0]?.actualData,
          "total": totalResultsFound,
        });
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
      }); 
    }
  });
  