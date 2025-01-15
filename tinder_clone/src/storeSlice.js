import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios, MAIN_URL } from "./axios";


import socketio from "socket.io-client";
export const socket = socketio(MAIN_URL, { transports: ["websocket"] });
console.log("MAIN_URL==", MAIN_URL);


export const allUserInitialData = createAsyncThunk(
  "userSlice/allUserInitialData",
  async (arg, thunkApi) => {
    // console.log("allUserInitialData==", arg);

    try {
      const { data } = await axios.get("/tinder/cards");
      console.log("data from get all UserData==", data);

      if (data) {
        thunkApi.dispatch(setAllUsers(data));
      }
    } catch (error) {
      console.log("error from get all UserData==", error);
    }
  }
);

// const getAllUSerData = createAsyncThunk("getAllUserSlice", async (args, thunkApi) => {
//   console.log("allUserInitialData==");
//   try {
//     const { data } = await axios.get("/tinder/cards");
//     console.log("allUserInitialData==", data);
//     if (data.length >= 0) {
//       thunkApi.dispatch(setAllUsers(data));
//     }
//     // return data;
//   } catch (error) {
//     console.log("error from get all UserData==", error);
//   }
// });

// getAllUSerData();

export const FB_login = createAsyncThunk(
  "user/FB_login",
  async (FB_token, thunkApi) => {
    try {
      const { data } = await axios.post("/FacebookLogin", { FB_token });
      if (data.success) {
        thunkApi.dispatch(login());
        thunkApi.dispatch(setProfileUser(data.user));
        thunkApi.dispatch(allUserInitialData());
      }
      if (!data.success) {
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
      }
      if (!data.success) {
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
    },
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
    onRightswipe: (state, action) => {
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
      let dataArray = action.payload;
      const availableUser = state.user.availableChatPeople;
      const chatWithPeople = [];
      const allUsers = [];

      // dataArray.forEach((User) => {
      //   const availableUser = state.user.availableChatPeople;
      //   if (availableUser.length > 0) {
      //     availableUser.forEach((userID) => {
      //       if (User._id === userID && User._id !== state.user._id) chatWithPeople.push(User);
      //       if (User._id !== state.user._id && User._id !== userID)allUsers.push(User);
      //     });
      //   } else {
      //     if (User._id !== state.user._id) {
      //       allUsers.push(User);
      //     }
      //   }
      // });
      if (availableUser) {
        availableUser.forEach((userID) => {
          const alluser = [];
          dataArray.forEach((User) => {
            if (User._id === userID && User._id !== state.user._id)
              chatWithPeople.push(User);
            if (User._id !== state.user._id && User._id !== userID)
              alluser.push(User);
          });
          dataArray = alluser;
        });
      } else {
        dataArray.forEach((User) => {
          if (User._id !== state.user._id) {
            allUsers.push(User);
          }
        });
      }

      state.allUsers = dataArray;
      state.availableChatPeople.push(...chatWithPeople);
    },
    setProfileUser: (state, action) => {
      state.user = action.payload;
      socket.emit("addUserToSocket", action.payload._id);
    },
    setChats: (state, action) => {
      state.chats.push(action.payload);
    },
  },
  extraReducers: {
    [allUserInitialData.pending]: (state, action) => {
      state.isLoading = true;
    },
    [allUserInitialData.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [allUserInitialData.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

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
