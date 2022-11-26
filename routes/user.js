const express = require("express")
const { register, login, verify,sendVerificationCode, logoutUser, resetPassword } = require("../controllers/user_credentials")
const {getUser, updateUser, followUnfollowPost: updateFollowStatus, DummyLogin} = require("../controllers/user_main")
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

//User Credentials routes:
router.post('/register',register)
router.post('/login', login)
router.post('/logout', logoutUser)
router.post('/verify', verify)
router.post('/sendverificationcode', sendVerificationCode)
router.put('/resetpassword',isAuthenticated, resetPassword)

//User Main routes:
//Done
router.get('/user/:id', isAuthenticated ,getUser)
//Done
router.put('/update/user', isAuthenticated ,updateUser)
//Done
router.put('/followfund/:id',isAuthenticated,updateFollowStatus)

router.get('/dummy/:category', DummyLogin)

module.exports = router