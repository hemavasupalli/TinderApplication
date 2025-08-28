const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//middleware tp convert json to javascript object
app.use(express.json());

app.post("/signup", async (req, res) => {
  //creatung new instance of user model
  const user = new User(req?.body);
  try {
    await user.save();
    res.send("user added succesfully");
  } catch (err) {
    res.status(400).send("error saving the user", err.message);
  }
});
//get user by email

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    // find will find all documents
    // findone will find one documents

    const user = await User.findOne({ emailId: email });
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("error getting the user", err.message);
  }
});
//feed api
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      res.status(404).send("No users exists");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("error getting the user", err.message);
  }
});

//delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);

    res.send("user deleted");
  } catch (err) {
    res.status(400).send("something went wrng");
  }
});

//patch or update  user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data ,{returnDocument :"nefore"});
console.log("hema",user)
    res.send("user updated");
  } catch (err) {
    res.status(400).send("something went wrng");
  }
});

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
