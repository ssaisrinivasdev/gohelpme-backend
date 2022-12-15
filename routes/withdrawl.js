const express = require("express")
const { createRequest, updateRequest, getRequest } = require("../controllers/withdrawl")
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

//User Credentials routes:
router.post('/create-request',isAuthenticated,createRequest)
router.put('/update-request-status/:id', updateRequest)
router.get('/request/:id', getRequest)
// router.get('/requests', getAllRequests)

module.exports = router