const express = require("express")
const { fundsVerificationDetails, usersPaymentVerificationDetails, withdrawlVerificationDetails
,fundApprovalsListDetails} = require("../controllers/dashboard")
const { query } = require("../controllers/queries")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');


router.get('/admin/funds-status/:category',fundsVerificationDetails);

router.get('/admin/user-status',usersPaymentVerificationDetails);

router.get('/admin/withdrawl-status',withdrawlVerificationDetails);

router.get('/admin/fund-approvals-list',fundApprovalsListDetails);


//Queries
router.post('/query',query);



module.exports = router