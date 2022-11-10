const express = require("express")
const { register, login, verify,sendVerificationCode, logoutUser, resetPassword } = require("../controllers/user_credentials")
const {getUser, updateUser, updateFollowStatus, DummyLogin} = require("../controllers/user_main")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

//User Credentials routes:
router.post('/register',register)
router.post('/login', login)
router.post('/logoutUser', logoutUser)
router.post('/verify', verify)
router.post('/sendVerificationCode', sendVerificationCode)
router.put('/resetpassword',isAuthenticated, resetPassword)

//User Main routes:
//Done
router.get('/user/:id', isAuthenticated ,getUser)
//Done
router.put('/update/user', isAuthenticated ,updateUser)
//OnHold
router.put('/follow-or-unfollow',isAuthenticated,updateFollowStatus)

router.post('/dummy',isAuthenticated, DummyLogin)

module.exports = router