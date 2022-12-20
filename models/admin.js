const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');
const Schema = mongoose.Schema;

const Admin = new mongoose.Schema({
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
        roles:{
            type: [String]
        },
        admin_type:{
            type: String,
			enum: ["co-admin", "admin","sub-admin"],
			default: "sub-admin",
        },
        createdBy:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'admin',
		}],
        updatedBy:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'admin',
		}],
		verification_code:		Number,
		verification_status: 	Boolean,
		verification_expiry:	Date,
		salt: 					String,
	},
	{timestamps: true},
	{ collection: 'admin' }
)

//Making password encrypted:
Admin.virtual("password")
	.set(async function (password) {
		this._password = password
		this.salt = uuidv1()
		this.encry_password = await this.securePassword(password)
	})
	.get(function() {
		return this._password
	})

//Adding inbuilt-type Schema Methods:
Admin.methods = {
  //returns whether password is correct or incorrect	
  authenticate: async function (plainpassword) {
    return await this.securePassword(plainpassword, this.salt) === this.encry_password
  },

  securePassword: async function(plainpassword, salt) {
    if(!plainpassword || plainpassword.length < 8) 
		return "";
    try 
	{
      return crypto.createHmac("sha256", salt).update(plainpassword).digest("hex");
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

const model = mongoose.model('admin', Admin)

module.exports = model