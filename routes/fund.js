const express = require("express")
const { getAllFunds, createFund, getFundDetails, searchFunds, fundsByCategory, addFundUpdates,
    updateFund,getTrendingFunds, updateFundStatus, getFundPaymentAddress} = require("../controllers/fund")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');
const {uploadFundDocuments, uploadFundImages} = require('../utils/awsFunctions');
const { isAdminAuthenticated } = require('../middleware/authAdmin');

router.get('/getallfunds',getAllFunds);
router.get('/fund/:id',getFundDetails);
router.get('/funds', fundsByCategory);
router.post('/createFund',isAuthenticated, uploadFundImages.array('images',3), createFund);
router.put('/addfundUpdates/:id',isAuthenticated, addFundUpdates)

router.get('/funds/search',searchFunds);

router.put('/updatefund/:id',isAuthenticated,updateFund);
router.put('/update-fund-request/:id',isAdminAuthenticated, updateFundStatus)
router.get('/trendingfunds',getTrendingFunds) 

router.get('/fund-payment-address/:id',getFundPaymentAddress)



module.exports = router