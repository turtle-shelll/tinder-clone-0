import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import FacebookLogin from "react-facebook-login";
import { useSelector } from "react-redux";
import { ONsuccessLogin, FB_login } from "../../storeSlice";
import ErrorMessages from "../ErrorC/ErrorMessages";
// import axios from "axios";
// import axios from "../../axios";
// import Logout from "./Logout";
// import { gapi } from "gapi-script";

function Login() {
  const clientId =
    "1019713917495-eo8ocq6ucpd0nlejgauvlq9gckmmor6p.apps.googleusercontent.com";
  const dispatch = useDispatch();
  const { errorMessages } = useSelector((state) => state.root);
  const responseFacebook = (response) => {
    console.log("FB_responce", response);
    const token = response.accessToken;
    if (!token) return;
    dispatch(FB_login(token));
  };
  const componentClicked = (data) => {
    console.log("data from facebook clicked***", data);
  };

  const onSuccess = (res) => {
    // console.log(
    //   "success",
    //   res.profileObj,
    //   res.tokenId
    //   // res.getAuthResponse().id_token
    // );
    const tokenId = res.tokenId;
    if (!tokenId) return;
    dispatch(ONsuccessLogin(tokenId));
  };

  const onFailure = (res) => {
    console.log("failure", res);
  };
  return (
    <div>
      <h1>Login_page</h1>
      <div className="form_container">
        <GoogleLogin
          clientId={clientId}
          buttonText={"Login with google"}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          // isSignedIn={true}
        />
      </div>
      <div>
        <FacebookLogin
          // appId="455087256201946"
          appId="706128744044691"
          autoLoad={false}
          fields="name,email,picture"
          onClick={componentClicked}
          callback={responseFacebook}
        />
      </div>
      {errorMessages && (
        <div className="error_container">
          <ErrorMessages errorMessages={errorMessages} />
        </div>
      )}
    </div>
  );
}
export default Login;
