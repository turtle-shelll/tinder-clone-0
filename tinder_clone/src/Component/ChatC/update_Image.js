import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
// import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { MAIN_URL } from "../../axios";
import { closeIt } from "../../storeSlice";
import "./updateImage.css";
function Update_Image({ updateImage }) {
  const [input, setInput] = useState("");
  const { updateImageData } = useSelector((state) => state.root);
  useEffect(() => {
    setInput(updateImageData[0]?.caption);
  }, [updateImageData]);
  console.log("data", updateImageData[0]?.caption);
  const dispatch = useDispatch();
  const newImageData = {
    conversationBy: updateImageData[0].conversationBy,
    messageFrom: updateImageData[0].messageFrom,
    message: updateImageData[0].message,
    caption: input,
  };
  // console.log("newImageData", newImageData);
  return (
    <div className="back_ground_container">
      <h1>Update image</h1>
      <div className="update_image_container">
        <div className="update_image_box">
          <div className="image">
            <img
              src={`${MAIN_URL}/uploads/${updateImageData[0]?.message?.imageUrl}`}
              alt={updateImageData[0]?.message?.imageUrl}
            />
          </div>
          <div className="caption_container">
            <input
              type="text"
              placeholder="Give Your Caption"
              id="caption"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="bottom_btn">
            <div className="btns">
              <IconButton
                // onClick={() => navigate(`/chats/${params.name}`)}
                onClick={() => dispatch(closeIt())}
                className="color-red"
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                className="color-green"
                onClick={() => {
                  updateImage(newImageData, updateImageData[0]._id);
                  dispatch(closeIt());
                }}
              >
                <CheckIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update_Image;
