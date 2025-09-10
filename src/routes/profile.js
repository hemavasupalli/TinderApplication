const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
require("dotenv").config();

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validations");
const { sanitizeUser } = require("../utils/validations.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(sanitizeUser(req.user));
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("user update not allowed");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json({message:"user updated",data: sanitizeUser(loggedInUser) });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        message: errors.join(", "),
      });
    }
  
    return res.status(400).json({ message: err.message || "Something went wrong" });
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
      res.send(sanitizeUser(user));
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
//feed api
profileRouter.get("/feed",userAuth, async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      res.status(404).send("No users exists");
    } else {
      res.send(sanitizeUser(user));
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = { profileRouter };
