const express = require("express");
const { getAllMessages } = require("../userControllers/chatControllers");
const router = express.Router();

router.get("/getAllMessages/:conversationID", getAllMessages);

module.exports = router;
