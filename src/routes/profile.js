const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      res.send(req.user);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

//get user by email

profileRouter.get("/user", async (req, res) => {
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
      res.status(400).send("Error: " + err.message);
    }
  });
  //feed api
  profileRouter.get("/feed", async (req, res) => {
    try {
      const user = await User.find({});
      if (!user) {
        res.status(404).send("No users exists");
      } else {
        res.send(user);
      }
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });


module.exports = { profileRouter };