// import mongoose from "mongoose";
const Mongoose = require("mongoose");

const conversation = new Mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
      index: true,
      ref: "TinderUser",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Conversation", conversation);
