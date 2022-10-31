const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');

//TODO: To add the commented properties
const Post = new mongoose.Schema({
		owner_id: {
			type: String,
			required: true,
			maxlength: 32,
			required: true,
			trim: true
		},
		title: {
			type: String,
			maxlength: 32,
            required: true,
			trim: true
		},
		short_description: {
			type: String,
			trim: true,
			unique: true
		},
		long_description: {
			type: String,
			trim: true,
			unique: true
		},
        funds: {
			type: String,   //Array
		},
        category: {
			type: String,   //Enum
		},
        fund_verified_documents: {
			type: String    //Array
		},
        currency: {
			type: String    //Currency
		},
        is_verified_status:     Boolean,
        fundtarget:             Number,
		liked_count:            Number,
        phone:                  Number,
        Address:                String,
        Country:                String,
        Zip_code:               String,
        city:                   String,
        tags:                   Array[5]
	},
	{timestamps: true},
	{ collection: 'user-data' 
})



const model = mongoose.model('user-datas', User)

module.exports = model