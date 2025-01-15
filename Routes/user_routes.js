const express = require("express");
const {
  GoogleLogin,
  checkStatus,
  TinderUser,
  FacebookLogin,
  CreateNewUser,
} = require("../userControllers/userControllers");

const router = express.Router();

router.post("/GoogleLogin", GoogleLogin);
router.get("/checkStatus/:token", checkStatus);
router.get("/tinder/cards", TinderUser);
router.post("/FacebookLogin", FacebookLogin);
router.post("/CreateNewUser", CreateNewUser);
module.exports = router;
