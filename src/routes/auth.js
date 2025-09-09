const express = require("express");
const authRouter = express.Router();

const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utils/sesClient.js");
const {
  validateSignUpData,
  validateForgotPasswordData,
} = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { dummyUsers } = require("./dummy");
const {
  emailParams,
  emailParamsForSignup,
  sanitizeUser,
} = require("../utils/utilFunctions.js");
authRouter.use(express.json());

// Signup
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Email is already registered. Please login or use another email.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      verified: false,
      otp,
      otpExpiry,
    });

    await user.save();
    await sesClient.send(
      new SendEmailCommand(emailParams(emailId, otp, firstName))
    );

    res.json({
      message: "OTP has been sent to your email.",
      data: { emailId: user.emailId },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).send("Error during signup: " + err.message);
  }
});

// Verify OTP
authRouter.post("/verifyOTP", async (req, res) => {
  try {
    const { emailId, otp } = req.body;
    const user = await User.findOne({ emailId });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.verified)
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });

    // Check OTP
    if (user.otp !== otp) {
      const attempts = (user.otpAttempts || 0) + 1;
      if (attempts >= 3) {
        await User.deleteOne({ _id: user._id });
        return res
          .status(400)
          .json({
            success: false,
            message: "Maximum OTP attempts exceeded. Please sign up again.",
          });
      }
      await User.updateOne({ _id: user._id }, { otpAttempts: attempts });
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid OTP. You have ${3 - attempts} attempts left.`,
        });
    }

    // Check expiry
    if (user.otpExpiry < new Date()) {
      await User.deleteOne({ _id: user._id });
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP expired. User deleted. Please sign up again.",
        });
    }

    if (user.otp === otp) {
      user.verified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = undefined;
      user.isOnline = true;

      const savedUser = await user.save();

      // Generate JWT only after verification
      const token = await savedUser.getJWT();
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

      await sesClient.send(
        new SendEmailCommand(emailParamsForSignup(emailId, user.firstName))
      );

      res.json({
        success: true,
        message: "Email verified successfully!",
        data: sanitizeUser(savedUser),
      });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Verification failed",
        error: err.message,
      });
  }
});

authRouter.post("/signupAll", async (req, res) => {
  try {
    validateSignUpData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      photoUrl,
    } = req.body;

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
      user.isOnline = true;
      await user.save();
      res.send(sanitizeUser(user));
    } else {
      throw new Error("Invalid Password");
    }
  } catch (err) {
    res.status(400).send("Error:  " + err.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();
    }
      res
        .cookie("token", null, { expires: new Date(Date.now()) })
        .send("logout successfull");
    
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});
authRouter.post("/forgotPassword", async (req, res) => {
  try {
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

    res.json({ message: "password has been reset", data: sanitizeUser(user) });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = { authRouter };
