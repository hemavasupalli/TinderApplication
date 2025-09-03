const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //read token from req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("please Login!");
    }
    const DecodedObj = await jwt.verify(token, "Hema@1234");
    const { _id } = DecodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user doesnt exist ");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};
//validate token

//find user

module.exports = { userAuth };
