import React from "react";

function Glogin() {
  return (
    <div>
      <h1>Google_Login</h1>
      <div>
        <div
          id="g_id_onload"
          data-client_id="1019713917495-eo8ocq6ucpd0nlejgauvlq9gckmmor6p.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-login_uri="http://localhost:3000"
          data-auto_prompt="false"
        ></div>

        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </div>
    </div>
  );
}

export default Glogin;
