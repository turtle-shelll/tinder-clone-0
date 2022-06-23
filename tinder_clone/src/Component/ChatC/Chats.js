import React from "react";
import SingleChat from "./singleChat";
import Header from "../HeaderC/Header";
// import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { axios } from "../../axios";
// import axios from "axios";
import { setConversationId } from "../../storeSlice";
function Chats() {
  const dispatch = useDispatch();
  const { availableChatPeople } = useSelector((state) => state.root);

  const saveConversation = async (conversationIDS) => {
    try {
      const { data } = await axios.post("/make_conversation", {
        conversationIDS,
      });
      if (data.success) {
        dispatch(setConversationId(data.conversationid));
        // console.log("conversationIDS has created successfully", data);
      }
    } catch (error) {
      console.log("error from saveConversation", error);
    }
  };
  return (
    <div>
      <Header backButton="/" />
      {/* <h1>there are no people right now to chats</h1> */}

      {availableChatPeople.map((person, index) => {
        return (
          <SingleChat
            otherUser={person}
            make_conversation={saveConversation}
            key={index}
            name={person?.fname}
            link={person?.fname}
            message={person?.message}
            timeStamp={person?.timeStamp}
            profilePic={person?.profilePicture}
          />
        );
      })}
    </div>
  );
}

export default Chats;
