const mongoose = require("mongoose");

//TODO: To add the commented properties
const DonationSchema = new mongoose.Schema({
        session_id: {
                type: String,
                required: true,
        },
        donator_name:           String,
        fund_id: 
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: "fundPost",
        },               
        donator_id:
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user-data",
        },         
        amount:                 Number,
        status:                 String,
        time:                   Date,
        payment_status:         String,
        payment_type:           String,
	},
        {timestamps: true},
        )

const model = mongoose.model('donation', DonationSchema)

module.exports = model