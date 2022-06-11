import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./storeSlice";
// import { rootReducer } from "./rootReducer";
const store = configureStore({
  reducer: {
    // root: rootReducer,
    root: userSlice,
  },
});

export default store;
