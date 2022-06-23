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
      // console.log("data from server==", data);
      if (data.length >= 0) {
        thunkApi.dispatch(setAllUsers(data));
      }
    } catch (error) {
      console.log("error from get all UserData==", error);
    }
  }
);

export const FB_login = createAsyncThunk(
  "user/FB_login",
  async (FB_token, thunkApi) => {
    try {
      const { data } = await axios.post("/FacebookLogin", { FB_token });
      console.log("data from FB-login==", data.user.availableChatPeople);
      if (data.success) {
        thunkApi.dispatch(login());
        thunkApi.dispatch(setProfileUser(data.user));
        thunkApi.dispatch(allUserInitialData());
        // thunkApi.dispatch(onRightswipe(data.user.availableChatPeople));
      }
      if (!data.success) {
        // thunkApi.dispatch(logout());
        thunkApi.dispatch(setErrorMessages(data.message));
      }
    } catch (error) {
      thunkApi.dispatch(setErrorMessages(error.response.data.message));
      console.log("error from FB_login:", error);
    }
  }
);

export const ONsuccessLogin = createAsyncThunk(
  "user/ONsuccessLogin",
  async (tokenId, thunkApi) => {
    try {
      const { data } = await axios.post("/GoogleLogin", { tokenId });
      if (data.success) {
        await thunkApi.dispatch(login());
        await thunkApi.dispatch(setProfileUser(data.user));
        thunkApi.dispatch(allUserInitialData());

        // await thunkApi.dispatch(onRightswipe(data.user.availableChatPeople));
      }
      if (!data.success) {
        // thunkApi.dispatch(logout());
        thunkApi.dispatch(setErrorMessages(data.message));
      }
    } catch (error) {
      thunkApi.dispatch(setErrorMessages(error.response.data.message));
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
  initialLoading: true,
  errorMessages: [],
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
    setInitialLoading: (state, action) => {
      state.initialLoading = false;
    },
    setErrorMessages: (state, action) => {
      state.errorMessages = action.payload;
    },
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
      console.log("action.payload==", action.payload);

      // if (Array.isArray(action.payload) && newChatPeopleLength > 0) {
      //   newChatPeopleLength.map((newUserId) => {
      //     const newChatPeople = state.availableChatPeople.find(
      //       (user) => user._id === newUserId
      //     );
      //     state.availableChatPeople.push(newChatPeople);
      //   });
      // }
      // const chatPeople = action.payload.forEach((userID) => {
      //   const thisUser = state.allUsers.filter((user) => {
      //     return user._id === userID;
      //   });
      //   console.log("thisUser: " + thisUser);
      //   return thisUser;
      // });
      // const thisUser = state.allUsers.find((user) => {
      //   return user._id === action.payload;
      // });
      // console.log("thisUser==", thisUser);
      // state.availableChatPeople.push(...thisUser);
      const thisUser = state.allUsers.find((user) => {
        return user._id === action.payload;
      });
      state.availableChatPeople.push(thisUser);
    },
    login: (state, action) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
    },
    setAllUsers: (state, action) => {
      const dataArray = action.payload;
      const chatWithPeople = [];
      const allUsers = [];
      dataArray.forEach((User) => {
        let alluser = [];
        const availableUser = state.user.availableChatPeople;
        if (availableUser.length > 0) {
        availableUser.forEach((userID) => {
          if (User._id === userID) {
            chatWithPeople.push(User);
          }
          if (User._id !== state.user._id && User._id !== userID) {
            alluser.push({ ...User });
          }
        });
      }else{
        if (User._id !== state.user._id) {
          alluser.push({ ...User });
        }
      }
        allUsers.push(...alluser);
      });
      state.allUsers = allUsers;
      state.availableChatPeople.push(...chatWithPeople);
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
  setErrorMessages,
  setInitialLoading,
  setAvailableChatPeople,
} = userSlice.actions;

export default userSlice.reducer;
