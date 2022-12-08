const express = require("express")
const { createPost, getPost, editPost, deletePost, getAllPosts} = require("../controllers/blog")
const { isAuthenticated } = require('../middleware/auth');
const {uploadFundImages} = require('../utils/awsFunctions');
const router = express.Router()

router.post('/create-post',  uploadFundImages.array('images',1), createPost);
router.get('/post/:id',getPost);
// router.put('/edit-post/:id',isAuthenticated, editPost);
// router.delete('/delete-post',isAuthenticated, deletePost);
router.get('/posts',getAllPosts);

module.exports = router