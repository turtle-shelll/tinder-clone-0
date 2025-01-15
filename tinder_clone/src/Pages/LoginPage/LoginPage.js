import React, { useEffect } from 'react'
import { gapi } from "gapi-script";

import Login from '../../Component/loginC/Login';

export default function LoginPage() {
    const clientId = "1019713917495-eo8ocq6ucpd0nlejgauvlq9gckmmor6p.apps.googleusercontent.com";
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: "email",
            });
        }
        gapi.load("client:auth2", start);
    }, []);
    return (
        <div className="g-signin">
            {/* <Login /> */}
            {/* <Glogin /> */}
            {/* <Logout /> */}
            <Login />
        </div>
    );
};