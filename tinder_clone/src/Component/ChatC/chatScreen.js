import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SingleChat from "./singleChat";
import { Avatar } from "@material-ui/core";
import ImageCard from "./imageCard";
import "./chatscreen.css";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useSelector, useDispatch } from "react-redux";
import { setUpdateImageData } from "../../storeSlice";
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
let receiversID;
const uploadFileToServer = (files, conversationId, userId, receivers) => {
  if (files.length > 10) return;
  newConversationID = conversationId;
  userID = userId;
  receiversID = receivers;
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
  socket.emit("image", imageDataForChats, receiversID);
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
  const { user, conversationId, isOpen, previosMessages } = useSelector(
    (state) => state.root
  );
  const dispatch = useDispatch();
  const param = useLocation().state.data;
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
    console.log("event==**", e);

    if (e.key === "Enter" || e.type === "click") {
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
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", sendMessage);
    return () => window.removeEventListener("keydown", sendMessage);
  }, [input]);

  socket.on("getPreviousMessages", async (preMessages) => {
    setMessage([...messages, ...preMessages]);
  });
  socket.on("backToUser", async (data) => {
    setMessage([...messages, data]);
  });
  socket.on("savedImages", async (data) => {
    setMessage([...messages, ...data]);
  });

  socket.on("reciavedImage", (reciavedImageData, imageID) => {
    const message = messages.map((msg, index) => {
      if (msg._id === imageID) {
        return reciavedImageData;
      } else {
        return msg;
      }
    });
    console.log("message", message);
    setMessage(message);
  });

  // socket.on("onGetImage", async (data) => {
  //   // const newData = await data;
  //   dispatch(setPreviosMessages([...messages, data]));
  // });
  socket.on("disconnect", () => {
    socket.emit("disconnected", user._id);
    socket.disconnect();
  });
  // /////function area of chat-screen starts here********************************

  const handlePostImage = async (newPostImages) => {
    setMessage([...messages, ...newPostImages]);
    socket.emit("postImage", newPostImages, param.otherUser._id);
    postImages = [];
  };

  const updateImage = (imageData, imageID) => {
    socket.emit("updateImage", imageData, imageID, param.otherUser._id);
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
                        caption={message?.caption}
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

                uploadFileToServer(
                  e.target.files,
                  conversationId,
                  user._id,
                  param.otherUser._id
                );
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
              onChange={(e) => {
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
