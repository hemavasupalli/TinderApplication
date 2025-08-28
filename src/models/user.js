const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
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
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "Female", "other"].includes(value)) {
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
