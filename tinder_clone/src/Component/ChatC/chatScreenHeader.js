import React from "react";
// import { Avatar } from '@mui/material'
import { Avatar } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@material-ui/core";
// import { useSelector } from "react-redux";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
import "./Single.css";

const ChatScreenHeader = ({
  name,
  link,
  message,
  timeStamp,
  profilePic,
  backButton,
  chatting,
  //   otherUser,
}) => {
  const navigate = useNavigate();

  return (
    <div className="chatBox">
      {backButton ? (
        <IconButton onClick={() => navigate(backButton)}>
          <ArrowBackIcon />
        </IconButton>
      ) : (
        ""
      )}
      <Link to={`/chats/${link}`} className="single_chat">
        <div className="profilePic">
          <Avatar className="pic" alt={name} src={profilePic} />
        </div>
        <div className="chat-context">
          <h2 className="person-name">{name}</h2>
          <h5 className="last-message">{message}</h5>
        </div>
      </Link>
      {chatting ? (
        <>
          <IconButton>
            <PhotoCameraFrontIcon />
          </IconButton>
        </>
      ) : (
        <p className="time-stamp">{timeStamp}</p>
      )}
    </div>
  );
};

export default ChatScreenHeader;
