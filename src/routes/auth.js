const express = require("express");
const authRouter = express.Router();
const {
  validateSignUpData,
  validateForgotPasswordData,
} = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
authRouter.use(express.json());

authRouter.post("/signup", async (req, res) => {
  //creating new instance of user model
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added succesfully");
  } catch (err) {
    res.status(400).send("Error saving:  " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if (isPasswordCorrect) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
      res.send("Logged in succesfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error:  " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("logout successfull");
});
authRouter.post("/forgotPassword", async (req, res) => {
  try {
    console.log(req.body);
    const { emailId, password } = req.body;
    validateForgotPasswordData(req);

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordSameAsOld = await bcrypt.compare(password, user.password);
    if (isPasswordSameAsOld) {
      throw new Error("You cannot use previous password");
    }
    const passwordHashed = await bcrypt.hash(password, 10);
    user.password = passwordHashed;
    await user.save();

    res.send("Password has been reset");
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = { authRouter };
