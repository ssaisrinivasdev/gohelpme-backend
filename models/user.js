const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');
const Schema = mongoose.Schema;

const User = new mongoose.Schema({
		name: {
			type: String,
			required: [true,"Please enter first name"],
			maxlength: [32,"First Name must be minimum of 32 characters"],
			trim: true
		},
		lastname: {
			type: String,
			required: [true, "Please enter last name"],
			maxlength: [32,"Last Name must be maximum of 32 characters"],
			trim: true
		},
		email: {
			type: String,
			trim: true,
			required: [true,"Please enter your email"],
			unique: true
		},
		encry_password: {
			type: String,
			required: [true, "Please make sure the password is atleast 8 characters"],
		},
		followed_funds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "fundPost",
			}
		],
		created_funds:[
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "fundPost",
			}
		],
		donated_funds:[
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "fundPost",
			}
		], 
		donations:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'donation',
		}],
		payment_request:{
			type: String,
			enum: ["NotRequested", "Requested","Approved", "Rejected"],
			default: "NotRequested",
		},
		verification_code:		Number,
		verification_status: 	Boolean,
		verification_expiry:	Date,
		salt: 					String,
	},
	{timestamps: true},
	{ collection: 'user-data' 
})

//Making password encrypted:
User.virtual("password")
	.set(async function (password) {
		this._password = password
		this.salt = uuidv1()
		this.encry_password = await this.securePassword(password)
	})
	.get(function() {
		return this._password
	})

//Adding inbuilt-type Schema Methods:
User.methods = {

  //returns whether password is correct or incorrect	
	authenticate: async function (plainpassword) {
		return await this.securePassword(plainpassword) === this.encry_password
	},

  securePassword: async function(plainpassword) {
    if(!plainpassword || plainpassword.length < 8) 
		return "";
    try 
	{
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex");
    } 
	catch (err) 
	{
      return "";
    }
  },

  verification: async function(verificationCode){
	console.log(verificationCode+" ="+this.verifiation_code)
	return await this.verifiation_code === verificationCode;
  },

  isVerified: async function(){
	return await this.verification_status;
  }

}

const model = mongoose.model('user-data', User)

module.exports = model