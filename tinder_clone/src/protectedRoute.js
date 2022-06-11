import React from "react";
import { Navigate } from "react-router-dom";
// import axios from "./axios";
// import Cookies from "js-cookie";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // console.log("go for login");
    return <Navigate to={"/login"} />;
  }
  // if (isAuthenticated) {
  //     return <Navigate  to={'/profile'}/>
  // }
  return children;
};

export default ProtectedRoute;
