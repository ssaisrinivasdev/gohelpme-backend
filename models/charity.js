const mongoose = require("mongoose");

//TODO: To add the commented properties
const CharitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is Required field"],
        unique: true
    },
    image:{
        type: String,
        required: [true,"Image is Required field"],
        unique: true
    },
    description: {
        type: String,
        required: [true,"Description is Required field"],
    },
    address: {
        type: String,
        required: [true,"Address is Required field"],
    },
    paypalAddress: {
        type: String,
        required: [true,"Paypal Address is Required field"],
    },
    contact_name: {
        type: String,
        required: [true,"Contact Name is Required field"],
        unique: true
    },
    contact_email: {
        type: String,
        required: [true,"Contact Email is Required field"],
        unique: true
    },
    website: {
        type: String,
        required: [true,"Website is Required field"],
        unique: true
    },
    keywords: {
        type: String,
        required: [true,"Keywords is Required field"],
    },
	},
    {timestamps: true},
)

const model = mongoose.model('charity', CharitySchema)

module.exports = model