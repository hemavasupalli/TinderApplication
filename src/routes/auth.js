const express = require("express");
const authRouter = express.Router();
const {
  validateSignUpData,
  validateForgotPasswordData,
} = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { dummyUsers } = require("./dummy");
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

    const savedUser= await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
    res.json({message:"user added succesfully",data:savedUser});
  } catch (err) {
    res.status(400).send("Error saving:  " + err.message);
  }
});

authRouter.post("/signupAll", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, age, gender, about, photoUrl } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      photoUrl,
      location,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
    res.json({ message: "user added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving: " + err.message);
  }
});

authRouter.post("/seedUsers", async (req, res) => {
  try {
    const usersWithHashedPassword = await Promise.all(
      dummyUsers.map(async (user) => {
        const passwordHash = await bcrypt.hash(user.password, 10);
        return { ...user, password: passwordHash };
      })
    );

    await User.insertMany(usersWithHashedPassword);

    res.json({ message: "50 users added successfully" });
  } catch (err) {
    res.status(500).send("Error seeding users: " + err.message);
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Email Id");
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if (isPasswordCorrect) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
      res.send(user);
    } else {
      throw new Error("Invalid Password");
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

    res.json({message:"password has been reset", data: user});
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = { authRouter };
