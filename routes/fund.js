const express = require("express")
const { getAllFunds, createFund, getFundDetails, searchFunds, fundsByCategory, addFundUpdates,
    updateFund} = require("../controllers/fund")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');
const {uploadFundDocuments, uploadFundImages} = require('../utils/awsFunctions');

router.get('/getallfunds',getAllFunds);
router.get('/fund/:id',getFundDetails);
router.get('/funds', fundsByCategory);
router.post('/createFund', uploadFundImages.array('images',3), createFund);
router.put('/addfundUpdates/:id',isAuthenticated, addFundUpdates)

router.get('/funds/search',searchFunds);

router.put('/updatefund/:id',isAuthenticated,updateFund);



module.exports = router