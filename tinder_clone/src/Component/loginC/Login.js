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
    // console.log("FB_responce", response);
    const token = response.accessToken;
    if (!token) return;
    dispatch(FB_login(token));
  };
  // const componentClicked = (data) => {
  //   console.log("data from facebook clicked***", data);
  // };

  const onSuccess = (res) => {
    const tokenId = res.tokenId;
    if (!tokenId) return;
    dispatch(ONsuccessLogin(tokenId));
  };

  // const onFailure = (res) => {
  //   console.log("failure", res);
  // };
  const ContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "#f5f5f5",
    marginTop: "-3rem",
    gap: "10px",
  };

  return (
    <div className="container" style={ContainerStyle}>
      <h2>Login_with Google</h2>
      <div className="form_container">
        <GoogleLogin
          clientId={clientId}
          buttonText={"Login with google"}
          onSuccess={onSuccess}
          // onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          // isSignedIn={true}
        />
      </div>
      <br />
      <br />
      <h2>OR</h2>
      <br />
      <br />
      <h2>Login_with facebook</h2>
      <div>
        <FacebookLogin
          appId="706128744044691"
          autoLoad={false}
          fields="name,email,picture"
          // onClick={componentClicked}
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
