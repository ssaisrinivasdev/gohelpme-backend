const express = require("express")
const { register, login, verify,forgotpassword } = require("../controllers/user")
const {check} = require('express-validator')
const router = express.Router()

router.post('/register', [
  check("name", "Name atleast should be 3 characters").isLength({min: 3}),
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 8 characters").isLength({min: 8}),
] ,register)

router.post('/login', login)
router.post('/verify', verify)
router.post('/forgotPassword', forgotpassword)


module.exports = router