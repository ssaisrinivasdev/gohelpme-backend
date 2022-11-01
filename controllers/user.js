const User = require("../models/user")
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const nodemailer = require('nodemailer');
const auth = require("../middleware/auth")

//Register - Business logic:
exports.register = (req, res) => {

  //Checking for validation errors
  const errors = validationResult(req)
  //Handling errors
  if(!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg
    })
  }

  //Authentication
  auth
  

  //Add JSON to the user
  const user = new User(req.body)
  const {email} = req.body
  User.findOne({email}, (err, resUser) => {
    if(resUser){
      return res.status(400).json({
        error: "User already exists"
      })
    }
    if(err) {
      return res.status(400).json({
        error: "Something went wrong please try again"
      })
    }
    var d = new Date()
    d.setMinutes(d.getMinutes() + 30)
    user.verification_expiry = d
    user.verification_status = false
    user.verification_code = initiateVerification(user.email)

    user.save((err, user) => {
      if(err)
        return res.status(400).json({message: err})

      return res.json({message: "Success"})
    })
  })

}

function initiateVerification(toMail){
  var verifiation_code = Math.random() * (999999 - 100000) + 100000

  //TODO: Send code to mail
  const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'sammyvasutalks@gmail.com',
          pass: 'lqffqbsmiqgvyuzf'
      }
  }) 
  
  const mailDetails = {
      from: 'sammyvasutalks@gmail.com',
      to: toMail,
      subject: 'Verification code',
      html: '<p>Hi ra kuyya!, Gammuna ah verification code cheppu</p><b/><b/><h3>Your verification code</h3><b/><h1>'+
        parseInt(verifiation_code)+'</h1>'
  }

  mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
        return res.status(400).json({message: "Something went wrong while send verification code"})
      }else {
          console.log('Email sent successfully');
      }
  });

  return parseInt(verifiation_code)
}


//Login - Business Logic:
exports.login = (req, res) => {
  const {email, password} = req.body

  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "Email was not found"
      })
    }

    // Authenticate user
    if(!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match"
      })
    }

    if(!user.isVerified()) {
      return res.status(400).json({
        error: "Verification failed"
      })
    }

    // Create token
    const token = jwt.sign(
			{
				email: user.email,  
			},
			'secret123'
		)

    // Put token in cookie
    const expiryDate = new Date()
    expiryDate.setMinutes(expiryDate.getMinutes() + 90)
    res.cookie('token', token, {expire: expiryDate})

    // Send response
    const {_id, name, email} = user
    return res.status(200).json({
      "message":"Sucsess",
      "token": token,
      "expiry":expiryDate
    })
    
  })
}

exports.verify = (req, res) => {
  const {email, verification_code,verification_expiry} = req.body

  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "Email was not found"
      })
    }
    console.log(verification_code+" "+ user.verification_code)

    // Authenticate user
    if(verification_code != user.verification_code) {
      return res.status(400).json({
        error: "Verification failed"
      })
    }
    
    user.verification_status  = true
    user.save((err, user) => {
      if(err) {
        return res.status(400).json({
          error: err
          
        })
      }
  
      return res.json({
        message: "Success",
        user
      })
    })
    
  })
}


//Register - Business logic:
exports.forgotpassword = (req, res) => { 
  
  const {email} = req.body
  initiateVerification(email)

}

// app.post('/api/login', async (req, res) => {
// 	const user = await User.findOne({
// 		email: req.body.email,
// 	})

// 	if (!user) {
// 		return { status: 'error', error: 'Invalid login' }
// 	}

// 	const isPasswordValid = await bcrypt.compare(
// 		req.body.password,
// 		user.password
// 	)

// 	if (isPasswordValid) {
// 		const token = jwt.sign(
// 			{
// 				name: user.name,
// 				email: user.email,
// 			},
// 			'secret123'
// 		)

// 		return res.json({ status: 'ok', user: token })
// 	} else {
// 		return res.json({ status: 'error', user: false })
// 	}
// })