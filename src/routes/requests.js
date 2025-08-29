const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connections");
const User = require("../models/user");

requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params?.toUserId;
    const status = req.params?.status;
    const ALLOWED_STATUS = ["interested", "ignored"];
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(500).json({
        message: "user doesnt exist ",
      });
    }
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(500).json({
        message: "invalid tatus Type: " + status,
      });
    }
    const existingConnectionReq = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionReq) {
      return res.status(500).json({
        message: "request already exists",
      });
    }
    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    await newConnectionRequest.save();
    res.send(user.firstName + " sent request");
  } catch (err) {
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
        res.status(500).json({ message: "status is not valid " + status });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        res.status(500).json({ message: "connection doesnt exist " });
      }

      connectionRequest.status = status;
      await connectionRequest.save();
      res.send("requested acepted");
    } catch (err) {
      res.status(500).send("Server Error: " + err.message);
    }
  }
);

module.exports = { requestsRouter };
