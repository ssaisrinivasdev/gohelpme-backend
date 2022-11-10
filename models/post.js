const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const catergoryArray = ["Medical","Memorial","Emergency","NonProfit","FinancialEmergency","Animals","Environment",
"Business","Community","Competition","Creative","Event","Faith","Family","Sports","Travel",
"Volunteer","Wishes","Others"];

//TODO: To add the commented properties
const Post = new mongoose.Schema({
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
        fund_verified_documents: {
			type: [String]    //Array
		},
        currency: {
			type: String    //Currency
		},
        is_verified_status:     Boolean,
		post_type: {
			type: String,
			enum: ["Individual", "Charity","Others"],
			required: true,
		},
		category: {
			type: String,
			enum: catergoryArray,
			required: true,
		},        
		goal:                   Number,
        currentValue:           Number,
        percent:                Number,
        totalDonationsCount:    Number,
		phone:                  Number,
        Address:                String,
        Country:                String,
        Zip_code:               String,
        city:                   String,
        tags: [String]
	},
	{timestamps: true},
)

const model = mongoose.model('fundPost', Post)

module.exports = model