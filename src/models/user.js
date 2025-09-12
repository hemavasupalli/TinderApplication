const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema, model } = mongoose;
const userSchema = new Schema(
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
      lowerCase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter correct email");
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
    age: {
      type: Number,
      validate(value) {
        if (value < 18 || value > 100) {
          throw new Error("Age must be between 18 and 100");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0yjZW2YKxsfv6JFUIkysx8WOpJRsOFSbAobQjQIGewrP-G0ZehZp0z_WathGC8NjlPMM&usqp=CAU",
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
    lastSeen: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },

    otp: { type: String },
    otpExpiry: { type: Date },
    otpAttempts: { type: Number, default: 0 }, // for OTP entry attempts
    resendAttempts: { type: Number, default: 0 }, // for resend OTP attempts
    isAdmin: { type: Boolean, default: false }, // admin flag

  },
  { timestamps: true }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = model("User", userSchema);

module.exports = User;
