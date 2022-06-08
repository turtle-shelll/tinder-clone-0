const { OAuth2Client } = require("google-auth-library");
// const cookieParser = require("cookie-parser");
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
    console.log("new-user==", user);

    const jwtToken = jwt.sign(
      { name: user.fname, id: user._id, email: user.email },
      "my_spacail_secret",
      { expiresIn: "3d" }
    );
    res.status(201).json({
      success: true,
      data: user,
      token: jwtToken,
      user: user,
    });
  } catch (error) {
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
      const jwtToken = jwt.sign(
        { name: user.fname, id: user._id, email: user.email },
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

const checkStatus = async (req, res, next) => {
  try {
    const token = req.params.token;
    console.log("token", token);
    const payload = jwt.verify(token, "my_spacail_secret");
    if (!payload) {
      return res.status(401).json({
        success: false,
        message:
          "the account you are trying to access is not authorized please login first",
      });
    }
    res.status(200).json({ success: true, message: "continue your work" });
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
    const user = await User.find({});
    res.status(200).send(user);
  } catch (error) {
    console.log("errorfrom tinder/cards===", error);
    res.status(500).send("something went wrong please try again!");
  }
};

module.exports = { GoogleLogin, checkStatus, TinderUser };
