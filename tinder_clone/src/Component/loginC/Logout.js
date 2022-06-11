import React from "react";
import { GoogleLogout } from "react-google-login";

function Logout() {
  const clientId =
    "1019713917495-eo8ocq6ucpd0nlejgauvlq9gckmmor6p.apps.googleusercontent.com";

  function logoutSuccess(res) {
    console.log("userngetting logout", res);
  }
  return (
    <div>
      <h1>Logout</h1>
      <div>
        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={logoutSuccess}
        />
      </div>
    </div>
  );
}

export default Logout;
