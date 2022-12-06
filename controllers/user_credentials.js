const User = require("../models/user")
const catchAsync = require('../middleware/catchAsync');
const sendCookie = require('../utils/sendCookie');
const sendEmail = require('../utils/sendEmail');




//Register - Business logic:
exports.register = catchAsync(async (req, res, next) => {
  try
  {
    //Add JSON to the user
    const user = new User(req.body)
    const {email} = req.body
    userFound = await User.findOne({
        $or: [{ email }]
    });

    if (userFound) {
      return res.status(401).json({
        error: "Email already exists",
        message: "Error"
      });
    }
    else
    {
      var d = new Date()
      d.setMinutes(d.getMinutes() + 30);
  
      user.verification_expiry = d
      user.verification_status = false
  
      user.verification_code = await sendEmail(user.email);
  
      user.save((err, user) => {
        if (err) {
          return res.status(401).json({
            error: "Something went wrong",
            message: err,
          });
        }
        else{
          return res.status(200).json({
            message: "Success", 
            email: user.email
          });
        }
      })
    }
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  }
});


//Login - Business Logic:
exports.login = catchAsync(async (req, res, next) => {

  try
  {
    const {email, password} = req.body

    User.findOne({email},async (err, user) => {
      if(err || !user) {
        return res.status(400).json({
          error: "Email was not found",
          message:"Error"
        })
      }

      // Authenticate user
      if(!(await user.authenticate(password))) {
        return res.status(400).json({
          error: "Email and password do not match",
          message: "Error"
        })
      }

      if(!(await user.isVerified())) {
        return res.status(400).json({
          error: "Verification failed",
          message: "Error"
        })
      }

      sendCookie(user, 201, res);
    })
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  }
});

//Verification
exports.verify = catchAsync(async (req, res, next) => {
  try{

    const {email, verification_code} = req.body

    const user = await User.findOne({ email: email });
  
    if(!user) {
      return res.status(401).json({
        error: "Email was not found",
        message: "Message"
      }); 
    }
  
    // Authenticate user
    if(verification_code != user.verification_code) {
      return res.status(401).json({
        error: "Verification failed",
        message: "Message"
      }); 
    }
    // var now = new Date()
    // if(verification_expiry > now){
    //   sendEmail(email);
    //   res.status(401).json({
    //     error: "Verification Code Expired, New verification code sent to your email please verify again",
    //     message: "Message"
    //   }); 
    // }
    // else{
      user.verification_status  = true
      user.save((err, user) => {
        if(err) {
          return res.status(401).json({
            error: "Something went wrong",
            message: err.toString(),
          }); 
        }
        sendCookie(user, 201, res);
      });
    // }
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    }); 
  }
});

// Logout User
exports.logoutUser = catchAsync(async (req, res, next) => {
  try{
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return res.status(200).json({
        message: "Logged Out",
    });
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
  });
  }
  
});

//Forgot Password - Business logic:
exports.sendVerificationCode  = catchAsync(async (req, res, next) => {
  try
  {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    
    const {email} = req.body

    const user = await User.findOne({ email: email });

    if(!user){
      return res.status(404).json({
        error: "Email was not found, Please register",
        message: "Error"
      });
    }

    var now = new Date()
    now.setMinutes(now.getMinutes() + 30);

    user.verification_expiry = now
    user.verification_status = false
    
    user.verification_code = await sendEmail(user.email);

    user.save((err, user) => {
      if(err){
        return res.status(400).json({
          error: "Something went wrong",
          message: err.toString(),
        });
      }
      return res.status(200).json({
        message: "Verification code sent to your mail"
      });
    })
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    });
  }
});


//resetPassword
exports.resetPassword = catchAsync(async (req, res, next) => {

  try{

    const user = await User.findById(req.user._id);

    if (!user){
      return res.status(404).json({
        error: "User Not Found",
        message: "Error"
      });
    }

    if(!req.body.password || req.body.password == null){
      return res.status(401).json({
        error: "Please enter the password",
        message: "Error"
      });
    }

    user.encry_password = await user.securePassword(req.body.password);

    await user.save();
    sendCookie(user, 200, res);
  }
  catch(err){
    return res.status(400).json({
      error: "Something went wrong",
      message: err.toString(),
    });
  }
});