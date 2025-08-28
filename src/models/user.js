const mongoose = require("mongoose");
const validator = require('validator');

const { Schema, model } = mongoose;
const userSchema = new Schema({
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
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("enter correct email")
        }
    }
    
  },
  password: {
    type: String,
    required: true,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("choose a strong password")
        }
    }
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("gender is not valid");
      }
    },
  },
  photoUrl: {
    type: String,
  },
  obout: {
    type: String,
    default: "this is a default about ",
  },
  skills: {
    type: [String],
  },
},{ timestamps:true
});

const User = model("User", userSchema);

module.exports = User;
