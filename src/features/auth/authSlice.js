import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null },
  reducers: {
    setCredentials: (state, actions) => {
      const { accessToken } = actions.payload;
      state.token = accessToken;
    },
    logOut: (state, actions) => {
      state.token = null;
    },
  },
});

export default authSlice.reducer;

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentToken = (state) => state.auth.token;
