const mongoose = require("mongoose");

const userPosts = new mongoose.Schema(
  {
    // userID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: [true, "please provide userID"],
    // },
    image: {
      data: Buffer,
      contentType: String,
    },
    fileName: {
      type: String,
      required: [true, "please provide fileName"],
    },
    fileSize: {
      type: Number,
      required: [true, "please provide fileSize"],
    },
    filePath: {
      type: String,
      required: [true, "please provide filePath"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPosts", userPosts);
