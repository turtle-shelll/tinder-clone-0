const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    conversationBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "conversationBy is required"],
    },
    messageFrom: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "please provide user to send messageFrom"],
    },
    message: {
      type: Object,
    },
    caption: {
      type: String,
    },
  },
  { timestamps: () => Math.floor(Date.now() / 1000) }
);

module.exports = mongoose.model("Chats", chatSchema);
