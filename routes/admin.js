const express = require("express")
const { admin, adminLogin, registerAdmin, updateSubAdmin} = require("../controllers/admin")
const {check} = require('express-validator')
const router = express.Router()
const { isAdminAuthenticated } = require('../middleware/authAdmin');

//Payments
// router.put('/admin',admin);
router.put('/login',adminLogin);
router.post('/add-subadmin', isAdminAuthenticated, registerAdmin);
router.put('/update-subAdmin/:id',isAdminAuthenticated, updateSubAdmin);
//router.get('/')



module.exports = router