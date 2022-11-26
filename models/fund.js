const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categoryArray = ["Medical","Memorial","Emergency","NonProfit","FinancialEmergency","Animals","Environment",
"Business","Community","Competition","Creative","Event","Faith","Family","Sports","Travel",
"Volunteer","Wishes","Others"];

//TODO: To add the commented properties
const Fund = new mongoose.Schema({
		owner:{
			type: Schema.Types.ObjectId,
			ref: 'user-data'
		},
		title: {
			type: String,
			maxlength: 60,
            required: true,
			trim: true,
			unique: true
		},
		long_description: {
			type: String,
			maxlength: 800, 
			required: true,
			trim: true,
			unique: false
		},
		images: {
			type: [String]    //Array
		},
        fund_verified_documents: {
			type: [String]    //Array
		},
        currency: {
			type: String    //Currency
		},
        verification_status:{
			type: String,
			enum: ["InProgress", "Approved","Rejected"],
			default: "InProgress",
		},
		rejection_reson: 		String,
		fund_type: {
			type: String,
			enum: ["Individual", "Charity","Others"],
			required: true,
		},
		category: {
			type: String,
			enum: categoryArray,
			required: true,
		},      
		donations:[{
			type: Schema.Types.ObjectId,
			ref: 'donation',
		}],
		currency:				String,
		goal:                   Number,
        currentValue:{
			type: Number,
			default: 0
		},
        percent:{
			type: Number,
			default: 0
		},
        totalDonationsCount:{
			type: Number,
			default: 0
		},
		// {
		// 	type: Number,
		// 	default: function() {
		// 	  return this.donations.length; 
		// 	}
		// },
		phone:                  Number,
        Address:                String,
        Country:                String,
        Zip_code:               String,
        city:                   String,
        tags: [String]
	},
	{timestamps: true},
)

const model = mongoose.model('fundPost', Fund)

module.exports = model