import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SingleChat from "./singleChat";
import { Avatar } from "@material-ui/core";
import ImageCard from "./imageCard";
import "./chatscreen.css";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useSelector, useDispatch } from "react-redux";
import {
  setUpdateImageData,
  setPreviosMessages,
  setInitialLoading,
  setChats,
} from "../../storeSlice";
import UpdateImage from "./update_Image";
// import { MAIN_URL } from "../../axios"; // axiosInstance
// import socketio from "socket.io-client";
// const socket = socketio(MAIN_URL, { transports: ["websocket"] });
// socket.on("connect", () => {
//   console.log("getting Connected", socket.id);
//   socket.emit("connection", );
// });
import { socket } from "../../storeSlice";

const siofu = require("socketio-file-upload");
const uploader = new siofu(socket);

let newConversationID;
let userID;
const uploadFileToServer = (files, conversationId, userId) => {
  if (files.length > 10) return;
  newConversationID = conversationId;
  userID = userId;
  uploader.listenOnInput(document.getElementById("siofu"));
};

uploader.addEventListener("complete", (event) => {
  const imageDataForChats = {
    conversationBy: newConversationID,
    messageFrom: userID,
    message: {
      imageUrl: event.detail.filePath,
    },
  };
  socket.emit("image", imageDataForChats);
});

socket.on("error", (error) => {
  console.log("error", error);
});
uploader.addEventListener("error", (error) => {
  console.log("Error: " + error);
});

let postImages = [];
socket.on("onGetImage", async (data) => {
  postImages.push(data);
});
// socket.on("disconnect", () => {
//   socket.emit("disconnected", socket.id);
//   socket.disconnect();
// });

export default function ChatScreen() {
  const {
    user,
    conversationId,
    isOpen,
    previosMessages,
    initialLoading,
    chats,
  } = useSelector((state) => state.root);
  const dispatch = useDispatch();
  const param = useLocation().state.data;
  console.log("params--params", param);
  const [input, setInput] = useState("");
  const [messages, setMessage] = useState([]);

  useEffect(() => {
    setMessage(previosMessages);
  }, [previosMessages]);

  useEffect(() => {
    setMessage([]);
    if (conversationId) {
      socket.emit("join", conversationId);
    }
  }, [conversationId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const trm = input.trim();
    if (trm === "") return setInput("");
    socket.emit(
      "message",
      {
        message: { textMessage: trm },
        messageFrom: user._id,
        conversationBy: conversationId,
      },
      param.otherUser._id
    );
    setInput("");
  };

  socket.on("getPreviousMessages", async (preMessages) => {
    setMessage([...messages, ...preMessages]);
  });
  socket.on("backToUser", async (data) => {
    setMessage([...messages, data]);
  });

  // socket.on("onGetImage", async (data) => {
  //   // const newData = await data;
  //   dispatch(setPreviosMessages([...messages, data]));
  // });
  socket.on("disconnect", () => {
    socket.emit("disconnected", user._id);
    socket.disconnect();
  });
  const handlePostImage = async (newPostImages) => {
    setMessage([...messages, ...newPostImages]);
    postImages = [];
  };

  const updateImage = (imageData, imageID) => {
    socket.emit("updateImage", imageData, imageID);
    const newMessages = messages.map((message, index) => {
      if (message._id === imageID) {
        return (message = imageData);
      }
      return message;
    });
    setMessage(newMessages);
  };
  const handleUpdateImage = (indexID) => {
    const newImageData = messages.filter((message, index) => {
      return message._id === indexID;
    });
    dispatch(setUpdateImageData(newImageData));
  };

  // handleDeleteImage and useEfect  are working good *******
  const handleDeleteImage = (indexID) => {
    const newMessages = messages.filter((message, index) => {
      return messages.indexOf(message) !== indexID;
    });
    setMessage(newMessages);
  };
  useEffect(() => {
    document.querySelector(".scrollToBottom").scrollIntoView();
  }, [messages]);
  return (
    <div className="chat_screen">
      {isOpen && <UpdateImage updateImage={updateImage} />}
      <SingleChat
        name={`${param.name}`}
        link={""}
        message={"is Typing..."}
        profilePic={param.profilePic}
        backButton={"/chats"}
        chatting={true}
      />

      <div className="chat_container">
        <p className="match_date">YOU MATCH WITH {param.name} ON 10/02/2022 </p>

        {messages.map((message, index) => {
          return (
            <div key={index}>
              {message.messageFrom !== user._id ? (
                <div className="text_container">
                  <div className="profile_frame">
                    <Avatar
                      className="profilePic"
                      // src={message.profile}
                      src={param.otherUser.profilePicture}
                      alt={param.name}
                    />
                  </div>
                  {message.message?.imageUrl ? (
                    <div className="image_container">
                      <ImageCard
                        indexID={index}
                        imageUrl={message?.message?.imageUrl}
                        imageName={message?.message?.imageUrl}
                        // handleDeleteImage={handleDeleteImage}
                        displayImage={false}
                      />
                    </div>
                  ) : (
                    <p className="text">{message?.message?.textMessage}</p>
                  )}
                </div>
              ) : (
                <div className="text_container">
                  {message.message?.imageUrl ? (
                    <div className="imageFrom_me">
                      <ImageCard
                        name={param.name}
                        imageID={message?._id}
                        indexID={index}
                        imageUrl={message?.message?.imageUrl}
                        imageName={message?.message?.imageUrl}
                        handleDeleteImage={handleDeleteImage}
                        displayImage={true}
                        handleUpdateImage={handleUpdateImage}
                        caption={message?.caption}
                      />
                    </div>
                  ) : (
                    <p className="textFrom_me">
                      {message?.message?.textMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {/* <ImageCard /> */}
        {/* bottom chat send box */}
        <div className="bottomCat_container">
          <div className="input_div">
            <input
              type={"file"}
              placeholder={<AddAPhotoIcon />}
              id="siofu"
              multiple
              accept="image/*"
              onInput={(e) => {
                e.preventDefault();

                uploadFileToServer(e.target.files, conversationId, user._id);
                setTimeout(() => {
                  handlePostImage(postImages);
                }, 1500);
              }}
            />
            <input
              type="text"
              name="message"
              placeholder="type your message"
              value={input}
              className="inp"
              // onInput={}
              onInput={(e) => {
                setInput(e.target.value);
              }}
            />
            <button type="submit" className="sendBtn" onClick={sendMessage}>
              send
            </button>
          </div>
        </div>
        <div className="scrollToBottom" />
      </div>
    </div>
  );
}
