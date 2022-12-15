const express = require("express")
const { fundsVerificationDetails, usersPaymentVerificationDetails, withdrawlVerificationDetails
,fundApprovalsListDetails, getWithdrawlRequestsList,getFinanceWithDrawls,getFinanceDonations} = require("../controllers/dashboard")
const { query } = require("../controllers/queries")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');


router.get('/admin/funds-status/:category',fundsVerificationDetails);

router.get('/admin/user-status',usersPaymentVerificationDetails);

router.get('/admin/withdrawl-status',withdrawlVerificationDetails);

router.get('/admin/fund-approvals-list',fundApprovalsListDetails);

router.get('/admin/finance/withdrawls',getFinanceWithDrawls);

router.get('/admin/finance/donations',getFinanceDonations);

router.get('/admin/withdrawl-approvals-list',getWithdrawlRequestsList);


//Queries
router.post('/query',query);



module.exports = router