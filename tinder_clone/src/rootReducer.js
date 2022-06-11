// import React from "react";
import { createReducer } from "@reduxjs/toolkit";
// import { Navigate } from "react-router-dom";
// import axios from "./axios";
export const rootReducer = createReducer(
  { isAuthenticated: false, allUsers: [] },
  {
    // let state.isAuthenticated = false;
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
  }
);
