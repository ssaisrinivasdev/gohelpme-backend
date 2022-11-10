const express = require("express")
const { getAllFunds, createPost, getPostDetails, searchPosts, postsByCategory, addPostUpdates,
    updatePost} = require("../controllers/post")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

router.get('/getallfunds',getAllFunds);
router.get('/post/:id',getPostDetails);
router.get('/posts', postsByCategory);
router.post('/createPost',isAuthenticated,createPost);
router.put('/addPostUpdates/:id',isAuthenticated, addPostUpdates)

router.get('/posts/search',searchPosts);

router.put('/updatepost/:id',isAuthenticated,updatePost);


module.exports = router