import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "./axios";
// import axios from "axios";

///// socket configuration   `http://localhost:5000/`
// import socketio from "socket.io-client";
// const ENDPOINT = "http://localhost:5000/";
// const socket = socketio(ENDPOINT, { transports: ["websocket"] });
// const siofu = require("socketio-file-upload");
// const uploader = new siofu(socket);

export const allUserInitialData = createAsyncThunk(
  "userSlice/allUserInitialData",
  async (arg, thunkApi) => {
    try {
      const { data } = await axios.get("/tinder/cards");
      console.log("data from server==", data);
      if (data.length >= 0) {
        thunkApi.dispatch(setAllUsers(data));
      }
    } catch (error) {
      console.log("error from get all UserData==", error);
    }
  }
);

export const ONsuccessLogin = createAsyncThunk(
  "user/ONsuccessLogin",
  async (tokenId, thunkApi) => {
    try {
      console.log("thunkApi==", thunkApi);
      // console.log("tokenId==", tokenId);
      const { data } = await axios.post("/GoogleLogin", { tokenId });
      if (data.success) {
        thunkApi.dispatch(login());
        thunkApi.dispatch(setProfileUser(data.user));
      }
      console.log("Google user server==", data);
    } catch (error) {
      console.log("error from google Login==", error);
    }
  }
);

const initialChatPeople = [
  {
    _id: "6291917af81356cab4b2ebd5",
    fname: "iron man",
    message: "I am comming.",
    timeStamp: "01 minutes ago",
    profilePicture:
      "https://1.bp.blogspot.com/-_vfLFYJowq4/X9hPgAyFEaI/AAAAAAAAOgM/13xHUTUw-TQlxKL9Q_oEamx_qod-25pxQCLcBGAsYHQ/s0/iron-man-2020-5k-2t-1440x2560.jpg",
  },
  {
    _id: "62919ae5f81356cab4b2ebdd",
    fname: "spider man",
    message: "I am in trouble Please help me.",
    timeStamp: "10 minutes ago",
    profilePicture:
      "https://i.pinimg.com/originals/f7/8d/2c/f78d2c667a9749225ef905da714cbff6.jpg",
  },
  {
    _id: "62919a83f81356cab4b2ebdc",
    fname: "Dr. strange",
    message: "It's Migic Time.",
    timeStamp: "05 minutes ago",
    profilePicture: "https://wallpapercave.com/wp/wp3965882.jpg",
  },
];

const initialState = {
  allUsers: [],
  isAuthenticated: false,
  user: {},
  availableChatPeople: initialChatPeople,
  chats: [],
  isLoading: true,
  conversationId: "",
  previosMessages: [],
  isOpen: false,
  updateImageData: {},
};

// console.log("conversationId==", initialState.conversationId);
const userSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setUpdateImageData: (state, action) => {
      state.updateImageData = action.payload;
    },
    openIt: (state, action) => {
      state.isOpen = true;
    },
    closeIt: (state, action) => {
      state.isOpen = false;
    },
    setPreviosMessages: (state, action) => {
      state.previosMessages = action.payload;
      // console.log("setPreviosMessages==", action.payload);
    },
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
    onRightswipe: (state, action) => {
      const thisUser = state.allUsers.find((user) => {
        return user._id === action.payload;
      });
      state.availableChatPeople.push(thisUser);
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      if (action) {
        state.user = action.payload;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
    },
    setAllUsers: (state, action) => {
      // const profileUser = state.user;
      // console.log("action==", action);
      // //////////////////////// check this ******************************************************
      // const data = action.payload;
      // console.log("data from get all users==", data);
      const newAllUsers = action.payload.filter((profilePerson) => {
        return profilePerson._id !== state.user._id;
      });
      // console.log("newAllUsers==", newAllUsers);
      state.allUsers = newAllUsers;
    },
    setProfileUser: (state, action) => {
      state.user = action.payload;
    },
    setChats: (state, action) => {
      state.chats.push(action.payload);
    },
  },
  extraReducers: {
    [allUserInitialData.pending]: (state, action) => {
      //   state.allUsers = action.payload;
      state.isLoading = true;
    },
    ////todays work is complate this as soon as possible///////////
    [allUserInitialData.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [allUserInitialData.rejected]: (state, action) => {
      state.isLoading = false;
      // state.allusers = [];
    },
  },
});

// console.log("userSlice==", userSlice);
export const {
  login,
  logout,
  setAllUsers,
  setChats,
  setProfileUser,
  onRightswipe,
  setConversationId,
  setPreviosMessages,
  openIt,
  closeIt,
  setUpdateImageData,
} = userSlice.actions;

export default userSlice.reducer;
