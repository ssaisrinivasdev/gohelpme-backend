const mongoose = require("mongoose");

//TODO: To add the commented properties
const UpdatesList = new mongoose.Schema({
        description:            String,
        createdAt:              Date,
        images:                 [String],
	})

const model = mongoose.model('address', AddressSchema)