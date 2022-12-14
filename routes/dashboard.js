const express = require("express")
const { fundsVerificationDetails, usersPaymentVerificationDetails, withdrawlVerificationDetails
,fundApprovalsListDetails, getWithdrawlRequestsList,getFinanceWithDrawls,getFinanceDonations,getBlogsList,
getQueriesList, getRolesList, getCharitiesRequestsList, getCharitiesList} = require("../controllers/dashboard")
const { query } = require("../controllers/queries")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');
const { isAdminAuthenticated } = require('../middleware/authAdmin');


router.get('/admin/funds-status/:category',fundsVerificationDetails);

router.get('/admin/user-status',usersPaymentVerificationDetails);

router.get('/admin/withdrawl-status',withdrawlVerificationDetails);

router.get('/admin/finance/withdrawls',getFinanceWithDrawls);

router.get('/admin/finance/donations',getFinanceDonations);

router.post('/admin/fund-approvals-list',fundApprovalsListDetails);

router.post('/admin/withdrawl-approvals-list',getWithdrawlRequestsList);

router.post('/admin/blogs',getBlogsList);

router.post('/admin/queries-list',getQueriesList);

router.get('/admin/roles-list',getRolesList);

router.put('/admin/charities-funds-list',getCharitiesRequestsList);

router.put('/admin/charities-list',getCharitiesList);

module.exports = router