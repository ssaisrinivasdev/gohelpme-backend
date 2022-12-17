const express = require("express")
const { createQuery, updateQuery, getQuery } = require("../controllers/queries")
const router = express.Router()
const { isAuthenticated } = require('../middleware/auth');

router.post('/create-request',createQuery)
router.put('/update-request-status/:id', updateQuery)
router.get('/request/:id', getQuery)

module.exports = router