const express = require("express")
const { payment, successPayment, cancelPayment} = require("../controllers/donation")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

//Payments
router.put('/payment',payment);
router.put('/successpayment', isAuthenticated,successPayment);
router.put('/cancelpayment/:id', cancelPayment);

//Donations
// router.put('/donation/:id', getDonation);


module.exports = router