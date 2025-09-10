const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connections");
const User = require("../models/user");
const {
  emailParamsForRequestAccepted,
  emailParamsForInterestSent,
} = require("../utils/emailParams.js");

require("dotenv").config();

requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params?.toUserId;
    const status = req.params?.status;
    const ALLOWED_STATUS = ["interested", "ignored"];

    // Validate user
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: "User does not exist",
        data: toUserId,
      });
    }
    // Validate status
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status,
        data: toUserId,
      });
    }

    // Check existing connection
    const existingConnectionReq = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionReq) {
      return res.status(400).json({ message: "Request already exists" });
    }

    // Create new connection request
    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const connection = await newConnectionRequest.save();

    if (status === "interested" && connection) {
      try {
        const emailRes = await SendEmailCommand(
          emailParamsForInterestSent(toUser?.emailId, user?.firstName)
        );
      } catch (emailErr) {
        console.error("SES email failed:", emailErr);
      }
    }

    // Send email (optional SES errors won't break the route)

    res.json({
      message: `${user.firstName} sent request`,
      data: newConnectionRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error: " + err.message);
  }
});

requestsRouter.post(
  "/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const ALlOWED_STATUS = ["accepted", "rejected"];
      if (!ALlOWED_STATUS.includes(status)) {
        return res
          .status(500)
          .json({ message: "status is not valid " + status });
      }
      const toUser = await User.findOne({
        _id: requestId,
      });
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(500).json({ message: "connection doesnt exist " });
      }

      connectionRequest.status = status;
      const connection = await connectionRequest.save();
      if (status === "accepted" && connection) {
        try {
          const emailRes = await SendEmailCommand(
            emailParamsForRequestAccepted(
              toUser?.emailId,
              loggedInUser?.firstName
            )
          );
        } catch (emailErr) {
          console.error("SES email failed:", emailErr);
        }
      }
      res.json({ message: "requested accepted", data: connectionRequest });
    } catch (err) {
      res.status(500).send("Server Error: " + err.message);
    }
  }
);

requestsRouter.post("/sendAll/:status", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const status = req.params?.status;
    const ALLOWED_STATUS = ["interested", "ignored"];

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status,
      });
    }

    // fetch all users except logged in user
    const allUsers = await User.find({ _id: { $ne: fromUserId } });
    if (!allUsers.length) {
      return res
        .status(404)
        .json({ message: "No users found to send requests" });
    }

    let createdRequests = [];

    for (const toUser of allUsers) {
      const existingConnectionReq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId: toUser._id },
          { fromUserId: toUser._id, toUserId: fromUserId },
        ],
      });

      if (!existingConnectionReq) {
        const newConnectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId: toUser._id,
          status,
        });
        await newConnectionRequest.save();
        createdRequests.push(newConnectionRequest);
      }
    }

    res.json({
      message: `Sent ${status} requests to ${createdRequests.length} users`,
      data: createdRequests,
    });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = { requestsRouter };
