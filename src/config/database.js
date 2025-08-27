const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://hemavasupalli12:Homosap%402024@clusterdevtinder.tpldqxf.mongodb.net/devTinder")
};

module.exports = connectDB;