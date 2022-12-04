const express = require("express")
const { payment, successPayment, cancelPayment} = require("../controllers/donation")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

//Payments
router.put('/admin',admin);
router.put('/add-subadmin',addSubAdmin);
router.put('/remove-subAdmin/:id',removeSubAdmin);

//router.get('/')



module.exports = router