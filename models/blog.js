const mongoose = require("mongoose");

//TODO: To add the commented properties
const blogPostSchema = new mongoose.Schema({
        images: {
			type: [String]    //Array
		},        
        title: {
			type: String,
            required: true,
			trim: true,
			unique: true
		},
		long_description: {
			type: String,
			maxlength: 1600, 
			required: true,
			trim: true,
			unique: false
		},
		status:{
			type: String,
			enum: ["Draft","Published"],
			default: "Draft",
	},
	},
    {timestamps: true},
)

const model = mongoose.model('blogPost', blogPostSchema)

module.exports = model