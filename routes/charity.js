const express = require("express")
const { createNewCharity, getAllCharities, deleteCharity, modifyCharity, getCharity,
    getChairtyFundPaymentAddress} = require("../controllers/charity")
const { isAuthenticated } = require('../middleware/auth');
const {uploadFundImages} = require('../utils/awsFunctions');
const router = express.Router()

router.post('/create-charity', uploadFundImages.array('image',1),createNewCharity);
router.get('/charity/:id',getCharity);
router.put('/edit-charity/:id', modifyCharity);
router.delete('/delete-charity/:id', deleteCharity);
router.get('/charities',getAllCharities);
router.get('/charity-payment-address/:id',getChairtyFundPaymentAddress)

module.exports = router