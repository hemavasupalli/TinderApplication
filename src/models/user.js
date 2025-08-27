const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName :{
        type: String
    },
    emailId:{
        type: String
    },
    password :{
        type: String
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    }

})

const User = model("User", userSchema);

module.exports = User;