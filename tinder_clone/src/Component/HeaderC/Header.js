import React from "react";
// import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
// import PersonIcon from "@mui/icons-material/Person";
import image from "./image/tinder.png";
import ForumIcon from "@mui/icons-material/Forum";
import { IconButton } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar } from "@material-ui/core";
import { useSelector } from "react-redux";
import "./Header.css";
function Header({ backButton }) {
  const { user } = useSelector((state) => state.root);
  const navigate = useNavigate();

  return (
    <div className="header">
      {/* <AccessAlarm/> */}
      {backButton ? (
        <IconButton onClick={() => navigate(backButton)}>
          <ArrowBackIcon />
        </IconButton>
      ) : (
        <IconButton>
          <Avatar alt={user.fname} src={user.profilePicture} />
        </IconButton>
      )}

      <Link to={"/"}>
        <IconButton>
          <img className="Logo-image" src={image} alt="Tinder-logo" />
        </IconButton>
      </Link>

      <Link to={"/chats"}>
        <IconButton>
          <ForumIcon />
        </IconButton>
      </Link>
    </div>
  );
}

export default Header;
