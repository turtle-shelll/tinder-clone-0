const { OAuth2Client } = require("google-auth-library");
// const cookieParser = require("cookie-parser");
const axios = require("axios");
const User = require("../DBmodels/userModel");
const jwt = require("jsonwebtoken");

const GoogleLogin = async (req, res) => {
  const { tokenId } = req.body;
  console.log("data==", tokenId);
  if (!tokenId) {
    return res.status(404).json({
      success: false,
      message: "invalid cradential please try again.",
    });
  }
  let newUser = {};
  const CLIENT_ID =
    "1019713917495-eo8ocq6ucpd0nlejgauvlq9gckmmor6p.apps.googleusercontent.com";
  const client = new OAuth2Client(CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload.email || !payload.email_verified) {
      return res.status(404).json({
        success: false,
        message: "the account you are trying to login is not a valid email",
      });
    }

    newUser = {
      fname: payload.name,
      userID: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      profilePicture: payload.picture,
      userFrom: "google",
    };

    // console.log("payLoad of gToken==", payload);
    const user = await User.create({ ...newUser });
    // console.log("new-user==", user);

    const jwtToken = await jwt.sign(
      { id: user._id, email: user.email },
      "my_spacail_secret",
      { expiresIn: "3d" }
    );
    res.status(201).json({
      success: true,
      // data: user,
      token: jwtToken,
      user: user,
    });
  } catch (error) {
    // find user if is error code is equal to duplicate error code///////
    if (error.code && error.code === 11000) {
      const user = await User.findOne({ email: newUser.email });
      if (!user) {
        // throw new UnauthenticatedError('Invalid credantials')
        return res
          .status(404)
          .json({ success: false, message: "Invalid credantials" });
      }
      if (!user.emailVerified) {
        return res.status(404).json({
          success: false,
          message:
            "the email you are try to login is not verified. please verify your email before trying again.",
        });
      }
      if (user && user.userFrom !== "google") {
        return res.status(401).json({
          message: `the email is you are tying is created by ${user.userFrom} login route.`,
          success: false,
        });
      }
      const jwtToken = await jwt.sign(
        { id: user._id, email: user.email },
        "my_spacail_secret",
        { expiresIn: "3d" }
      );
      // console.log("error == =", error);
      res.json({
        success: true,
        message: "go for profile.",
        token: jwtToken,
        user: user,
      });
    }
  }
};

const FacebookLogin = async (req, res) => {
  const { FB_token } = req.body;
  // console.log("its working fb route", FB_token);
  if (!FB_token)
    return res
      .status(200)
      .json({ success: false, message: "access token is not present" });

  let newUser = {};
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v12.0/me?access_token=${FB_token}&fields=name,email,first_name,last_name,middle_name,name_format,picture,short_name&method=get&pretty=0&sdk=joey&suppress_http_code=1`
    );
    // console.log("data of fb user ==**", data);
    if (!data)
      return res
        .status(200)
        .json({ success: false, message: "access token is not valid" });

    if (!data.email) {
      // console.log("chaking data.email is present or not", data?.email_verified);
      return res.status(200).json({
        success: false,
        message:
          "the facebook account you are trying is not have  email please try with other acount",
      });
    }

    newUser = {
      fname: data.name,
      email: data.email,
      password: data.id,
      emailVerified: data.email ? true : false,
      profilePicture: data.picture.data.url,
      userFrom: "facebook",
    };
    // console.log("newUser==", newUser);
    const user = await User.create({ ...newUser });

    const jwtToken = await jwt.sign(
      { id: user._id, email: user.email },
      "my_spacail_secret",
      { expiresIn: "3d" }
    );
    return res.status(201).json({
      success: true,
      user: user,
      token: jwtToken,
      message: "login success",
    });
  } catch (error) {
    if (error && error.code === 11000) {
      // console.log("duplicate user is present", error);
      const user = await User.findOne({ email: newUser.email });
      // console.log("user==", user);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid credantials" });
      }
      if (!user.emailVerified) {
        return res.status(200).json({
          success: false,
          message:
            "the email you are try to login is not verified. please verify your email before trying again.",
        });
      }
      if (user.userFrom !== "facebook") {
        return res.status(200).json({
          success: false,
          message: `the account you are trying to login is created by ${user.userFrom} login route.`,
        });
      }
      const jwtToken = await jwt.sign(
        { id: user._id, email: user.email },
        "my_spacail_secret",
        { expiresIn: "3d" }
      );
      return res.status(200).json({
        success: true,
        message: "go for profile.",
        user: user,
        token: jwtToken,
      });
    }
    console.log("errorfrom FB_login==**", error);
  }
};

const CreateNewUser = async (req, res) => {
  try {
    const { fname, email, emailVerified, profilePicture } = req.body;
    if (!fname, !email, !emailVerified, !profilePicture) {
      return res.status(200).json({ success: false, message: "all the Above fields are required." });
    };
    const user = await User.create({ fname, email, emailVerified, profilePicture });
    console.log("user==>>>>> ", user);
    res.status(201).json({ success: true, user: user });
  } catch (error) {
    console.error("error from CreateNewUser==", error);
  };
};

const addToChat = async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res
      .status(200)
      .json({ success: false, message: "userID does not exist" });
  }
  try {
    const userWith_inChating = await User.findOne({ _id: userID });
    const availableChatPeople = await ChatPeople.find({
      conversationIDS: userID,
    });
  } catch (error) {
    console.log("error from addToChat==", error);
  }
};

const checkStatus = async (req, res, next) => {
  try {
    const token = req.params.token;
    // console.log("token", token);
    const payload = jwt.verify(token, "my_spacail_secret");
    if (!payload) {
      return res.status(401).json({
        success: false,
        message:
          "the account you are trying to access is not authorized please login first",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "continue your work" });
  } catch (error) {
    console.log("err from check status", error);
    return res.status(200).json({
      success: false,
      message: "something went wrong please try again later",
    });
  }
};

const TinderUser = async (req, res) => {
  try {
    console.log("its working");
    const user = await User.find({});
    // const user = await User.findOne({ email: "hardik.20022013@gmail.com" });
    console.log("user==", user);
    res.status(200).send(user);
  } catch (error) {
    console.log("errorfrom tinder/cards===", error);
    res.status(500).send("something went wrong please try again!");
  }
};

module.exports = { GoogleLogin, checkStatus, TinderUser, FacebookLogin, CreateNewUser };
