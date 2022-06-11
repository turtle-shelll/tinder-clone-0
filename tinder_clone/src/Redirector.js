import React from "react";
import { Navigate } from "react-router-dom";

const Redirector = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    console.log("go for profile");
    return <Navigate to={"/"} />;
  }
  // if (!isAuthenticated) {
  //     return <Navigate to={'/login'}/>;
  // }
  // if (isAuthenticated) {
  //     return <Navigate  to={'/profile'}/>
  // }
  return children;
};

export default Redirector;
