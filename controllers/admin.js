const Admin = require("../models/admin")
const catchAsync = require('../middleware/catchAsync');
const sendCookie = require('../utils/sendAdminCookie');
const { v1: uuidv1 } = require('uuid');

exports.registerAdmin = catchAsync(async (req, res, next) => {

    try
    {
      const currentAdmin = req.admin
      const adminFound = await Admin.findOne({
          $or: [ {"email": req.body.email}]
      });
      let admin = null

      if (adminFound) {
        return res.status(401).json({
            error: "Email already exists",
            message: "Error"
        });
      }
      else
      {
        if(currentAdmin.admin_type==="admin"){
            if(req.body.admin_type != "admin"){
                const a = new Admin();
                const salt = uuidv1()
                const _password = await a.securePassword(req.body.password, salt)
                const adminLog = {
                    email : req.body.email,
                    encry_password : _password,
                    admin_type : req.body.admin_type,
                    roles: req.body.roles,
                    salt: salt
                }
                admin = await Admin.create(adminLog);
                admin.createdBy.push(currentAdmin.id);
                await admin.save();
                return res.status(200).json({
                    message: "Success", 
                    admin
                });
            }else{
                return res.status(403).json({
                    error: "You don't have permissions to make this request",
                    message: "Error",
                });
            }
        }else if(currentAdmin.admin_type==="co-admin"){
            if(req.body.admin_type === "sub-admin"){
                const a = new Admin();
                const salt = uuidv1()
                const _password = await a.securePassword(req.body.password, salt)
                const adminLog = {
                    email : req.body.email,
                    encry_password : _password,
                    admin_type : req.body.admin_type,
                    roles: req.body.roles,
                    salt: salt
                }
                admin = await Admin.create(adminLog);
                admin.createdBy.push(currentAdmin.id);
                await admin.save();
                return res.status(200).json({
                    message: "Success", 
                    admin
                });
            }else{
                return res.status(403).json({
                    error: "You don't have permissions to make this request",
                    message: "Error",
                });
            }
        }else{
            return res.status(403).json({
                error: "You don't have permissions to make this request",
                message: "Error",
            });
        }
      }
    }
    catch(err){
      return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
      }); 
    }
  });

exports.adminLogin = catchAsync(async (req, res, next) => {
    try
    {
      const {email, password} = req.body

      Admin.findOne({email},async (err, admin) => {
        if(err || !admin) {
            return res.status(400).json({
            error: "Email was not found",
            message:"Error"
            })
        }

        // Authenticate user
        if(!(await admin.authenticate(password))) {
            return res.status(400).json({
            error: "Email and password do not match",
            message: "Error"
            })
        }

        sendCookie(admin, 201, res);
        })
    }
    catch(err){
        return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
        }); 
    }
});

exports.updateSubAdmin = catchAsync(async (req, res, next) => {
    try
    {
        const currentAdmin = req.admin
        const adminFound = await Admin.findById(req.params.id)
        let admin = null

        if (!adminFound) {
          return res.status(401).json({
              error: "Invalid Email",
              message: "Error"
          });
        }
        else
        {
          if(currentAdmin.admin_type==="admin"){
              if(adminFound.admin_type != "admin"){
                await Admin.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: true,
                  });
                  admin = await Admin.findById(req.params.id);
                  admin.updatedBy.length = 0;
                  admin.updatedBy.push(currentAdmin.id);
                  await admin.save();
                  return res.status(200).json({
                      message: "Success", 
                      admin
                  });
              }else{
                  return res.status(403).json({
                      error: "You don't have permissions to make this request",
                      message: "Error",
                  });
              }
          }else if(currentAdmin.admin_type==="co-admin"){
              if(adminFound.admin_type === "sub-admin"){
                  await Admin.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: true,
                  });
                  admin = await Admin.findById(req.params.id);
                  admin.updatedBy.length = 0;
                  admin.updatedBy.push(currentAdmin.id);
                  await admin.save();
                  return res.status(200).json({
                      message: "Success", 
                      admin
                  });
              }else{
                  return res.status(403).json({
                      error: "You don't have permissions to make this request",
                      message: "Error",
                  });
              }
          }else{
              return res.status(403).json({
                  error: "You don't have permissions to make this request",
                  message: "Error",
              });
          }
        }      
    }
    catch(err){
        return res.status(400).json({
        error: "Something went wrong",
        message: err.toString(),
        }); 
    }
});

