const express = require("express")
const { adminDashboard} = require("../controllers/dashboard")
const {check} = require('express-validator')
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');


router.get('/admin/dashboard-details/:category',adminDashboard);



module.exports = router