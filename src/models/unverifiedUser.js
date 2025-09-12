const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema, model } = mongoose;

const UnverifiedUserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Choose a strong password");
        }
      },
    },

    // OTP related
    otp: { type: String },
    otpExpiry: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    resendAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// TTL index for auto-cleanup
UnverifiedUserSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

// JWT for temporary session (if needed before verification)
UnverifiedUserSchema.methods.getJWT = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "10m", // short-lived since it's unverified
  });
};

// Password check
UnverifiedUserSchema.methods.validatePassword = async function (passwordInputByUser) {
  return bcrypt.compare(passwordInputByUser, this.password);
};

const UnverifiedUser = model("UnverifiedUser", UnverifiedUserSchema);
module.exports = UnverifiedUser;
