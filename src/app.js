const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

// app.use("/test",(req,res)=>{
//     res.send("Hi ram ")
// })

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: 11,
    lastName: "vasupalli",
    emailId: "anil@gmail.com",
    password: "anil@1234",
    hjel:"7"
  };
  //creatung new instance of user model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("user added");
  } catch (err) {
    res.status(400).send("error saving the user", err.message);
  }
});

// app.get("/users",async(req,res)=>{
//     try{
//         await user.save();
//     res.send("user added")
//     }catch(err){
//         res.status(400).send("error saving the user", err.message)

//     }
// })

connectDB()
  .then(() => {
    console.log("Database successfully connected");
    app.listen(3000, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
