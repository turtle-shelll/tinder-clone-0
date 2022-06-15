import React from "react";
// import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@material-ui/core";
import { axios, MAIN_URL } from "../../axios";
// import axios from "axios";
import "./imageCard.css";
import { useDispatch } from "react-redux";
import { openIt } from "../../storeSlice";
// const imageUrl =
//   "https://i.pinimg.com/originals/f7/8d/2c/f78d2c667a9749225ef905da714cbff6.jpg";
function ImageCard({
  key,
  imageUrl,
  imageName,
  handleDeleteImage,
  indexID,
  displayImage,
  imageID,
  caption,
  handleUpdateImage,
}) {
  const dispatch = useDispatch();

  return (
    <div className="image_container">
      <div className="imageCard">
        <img
          key={key}
          src={`${MAIN_URL}/uploads/${imageUrl}`}
          alt={imageName}
        />
      </div>
      {caption && <div className="caption">{caption}</div>}

      <div className="image_button_icons">
        {displayImage && (
          <div key={key} className="image_button">
            <IconButton
              onClick={async () => {
                handleDeleteImage(indexID);
                // console.log("imageID: ", imageID);
                const reqData = await axios.delete(
                  `/deleteImage/${imageUrl}/${imageID}`
                );
                // console.log("reqData deleteImage", reqData);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleUpdateImage(imageID);
                dispatch(openIt());
              }}
            >
              <EditIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCard;
