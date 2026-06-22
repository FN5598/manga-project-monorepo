import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type User } from "@appTypes/User";

export type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
};

const initialState: AuthState = { user: null, isLoggedIn: false };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserGlobalState: (
      state,
      action: PayloadAction<{ user: User; isLoggedIn: boolean }>,
    ) => {
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
    },

    clearUserGlobalState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export default userSlice.reducer;
export const { setUserGlobalState, clearUserGlobalState } = userSlice.actions;
