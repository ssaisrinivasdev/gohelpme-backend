const express = require("express")
const { createRequest, updateRequest, getRequest,RequestsForFund,
    createAndAcceptCharityRequest } = require("../controllers/withdrawl")
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

//User Credentials routes:
router.post('/create-request',isAuthenticated,createRequest)
router.put('/update-request-status/:id', updateRequest)
router.get('/request/:id', getRequest)
router.get('/all-requests/:fundId', RequestsForFund)
router.put('/update-charity/:fund_id',createAndAcceptCharityRequest)

module.exports = router