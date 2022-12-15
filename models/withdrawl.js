const mongoose = require("mongoose");

//TODO: To add the commented properties
const WithdrawlSchema = new mongoose.Schema({
        fund: 
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: "fundPost",
        },               
        owner:
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user-data",
        },         
        withdrawl_status:{
                type: String,
                enum: ["Requested","Approved","Rejected"],
                default: "Requested",
        },
        withdrawl_amount:       Number,
        rejected_reason:        String,
	},
        {timestamps: true},
        )

const model = mongoose.model('withdrawl', WithdrawlSchema)

module.exports = model