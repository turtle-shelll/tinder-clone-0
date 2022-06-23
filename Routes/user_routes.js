const express = require("express");
const {
  GoogleLogin,
  checkStatus,
  TinderUser,
  FacebookLogin,
} = require("../userControllers/userControllers");

const router = express.Router();

router.post("/GoogleLogin", GoogleLogin);
router.get("/checkStatus/:token", checkStatus);
router.get("/tinder/cards", TinderUser);
router.post("/FacebookLogin", FacebookLogin);
module.exports = router;
