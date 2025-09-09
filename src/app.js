const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {authRouter}  = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestsRouter}  = require("./routes/requests");
const { userRouter } = require("./routes/user");
const { chatRouter } = require("./routes/chat");
const http = require("http");
const { initiateSocket } = require("./utils/socket");

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
app.use("/", chatRouter);


const server = http.createServer(app);
initiateSocket(server);
connectDB()
  .then(() => {
    console.log("Database successfully connected");
    server.listen(process.env.PORT, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
