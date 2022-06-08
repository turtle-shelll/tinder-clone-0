const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "please provide your name"],
    },
    email: {
      unique: true,
      type: String,
      // index: true,
      required: [true, "please provide Email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please provide valide Email",
      ],
    },
    userID: String,
    profilePicture: String,
    emailVerified: String,
    userFrom: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TinderUser", userSchema);
