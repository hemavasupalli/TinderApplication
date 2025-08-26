const express = require('express');
const connectDB = require("./config/database")
const app = express();

// app.use("/test",(req,res)=>{
//     res.send("Hi ram ")
// })

connectDB().then(()=>{
    console.log("Database successfully connected")
    app.listen(3000,()=>{
        console.log("server started")
    });
}).catch(err=>{
    console.log("Database cannot be connected")

})

