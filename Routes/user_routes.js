const express = require("express");
const {
  GoogleLogin,
  checkStatus,
  TinderUser,
} = require("../userControllers/userControllers");

const router = express.Router();

router.post("/GoogleLogin", GoogleLogin);
router.get("/checkStatus/:token", checkStatus);
router.get("/tinder/cards", TinderUser);
module.exports = router;
