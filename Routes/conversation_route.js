const express = require("express");
const { saveConversation } = require("../userControllers/conversation");

const router = express.Router();

router.post("/make_conversation", saveConversation);

module.exports = router;
