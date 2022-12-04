const mongoose = require("mongoose");

//TODO: To add the commented properties
const QueriesSchema = new mongoose.Schema({
        full_name:              String,         
        email:                  String,
        message:                String,
        ticket_status:{
			type: String,
			enum: ["Opened", "Investigating","Completed"],
			default: "Opened",
		},
	},
    {timestamps: true},
)

const model = mongoose.model('query', QueriesSchema)

module.exports = model