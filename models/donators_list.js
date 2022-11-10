const mongoose = require("mongoose");

//TODO: To add the commented properties
const AddressSchema = new mongoose.Schema({
        name:                   String,
        id:                     String,
        Amount:                 Number,
        donatedAt:              Date,
        status:                 String,
        error:                  String,
        transaction_id:         String
	})

const model = mongoose.model('donatersList', AddressSchema)