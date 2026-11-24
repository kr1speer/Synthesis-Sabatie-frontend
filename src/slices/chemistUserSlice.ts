import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChemistUserOut } from "../api/Api";

interface ChemistUserState {
  chemistLogin: string;
  fullName: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ChemistUserState = {
  chemistLogin: "",
  fullName: "",
  isAuthenticated: false,
  loading: false,
  error: null,
};

const chemistUserSlice = createSlice({
  name: "chemistUser",
  initialState,
  reducers: {
    chemistUserRequestStarted(state) {
      state.loading = true;
      state.error = null;
    },

    chemistUserLoggedIn(state, action: PayloadAction<ChemistUserOut>) {
      state.chemistLogin = action.payload.chemist_login;
      state.fullName = action.payload.full_name;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    chemistUserLoggedOut() {
      return initialState;
    },

    chemistUserRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  chemistUserRequestStarted,
  chemistUserLoggedIn,
  chemistUserLoggedOut,
  chemistUserRequestFailed,
} = chemistUserSlice.actions;

export default chemistUserSlice.reducer;
