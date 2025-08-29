const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const connectionRequestSchema = Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        value: ["interested", "ignored"],
        message: `{VALUE} is incorrect status type`,
      },
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
connectionRequestSchema.index({fromUserId:1 ,toUserId:1});

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("cannot send request to yourself");
  }
  next();
});

const ConnectionRequest = model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
