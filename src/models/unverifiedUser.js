const mongoose = require("mongoose");

const UnverifiedUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  otp: String,
  otpExpiry: Date,
  signupAt: { type: Date, default: Date.now },
},{timestamps:true});

module.exports = mongoose.model("UnverifiedUser", UnverifiedUserSchema);
