const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');

const User = new mongoose.Schema({
		name: {
			type: String,
			required: true,
			maxlength: 32,
			trim: true
		},
		lastname: {
			type: String,
			maxlength: 32,
			trim: true
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true
		},
		encry_password: {
			type: String,
			required: true
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
	.set(function(password) {
		this._password = password
		this.salt = uuidv1()
		this.encry_password = this.securePassword(password)
	})
	.get(function() {
		return this._password
	})

//Adding inbuilt-type Schema Methods:
User.methods = {

  //returns whether password is correct or incorrect	
  authenticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password
  },

  securePassword: function(plainpassword) {

    if(!plainpassword) return "";

    try {
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
    } catch (err) {
      return ""
    }
  },

  verification: function(verificationCode){
	console.log(verificationCode+" ="+this.verifiation_code)
	return this.verifiation_code === verificationCode;
  },
  isVerified: function(){
	return this.verification_status;
  }

}

const model = mongoose.model('user-data', User)

module.exports = model