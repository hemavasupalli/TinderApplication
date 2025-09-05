const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {authRouter}  = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestsRouter}  = require("./routes/requests");
const { userRouter } = require("./routes/user");
require("dotenv").config();
require("./utils/cronJob");
//middleware tp convert json to javascript object
app.use(cors(
  {
    origin:"http://localhost:5173",
    credentials:true
  }
));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);



connectDB()
  .then(() => {
    console.log("Database successfully connected");
    app.listen(process.env.PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
