const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connections");
const User = require("../models/user");
const USER_DATA = "firstName lastName age gender photoUrl about skills";
//pending
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);
    console.log(connectionRequests);
    res.json({
      message: "data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    console.log(data);
    res.json({
      message: "data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = { userRouter };
