import React from "react";
import { Navigate } from "react-router-dom";

const Redirector = ({ isAuthenticated, children }) => {
  // const navigate = useNavigate();
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return children;
};

export default Redirector;
