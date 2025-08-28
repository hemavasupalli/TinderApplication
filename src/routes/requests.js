const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestsRouter.post("/sendConnectionReq", userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent request");
  });


module.exports = { requestsRouter };