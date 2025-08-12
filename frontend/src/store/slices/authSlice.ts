import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { userId: string; role: 'admin' | 'candidate' | 'employer'; name?: string; verified: boolean; rejectionReason?: string; } | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: { userId: string; role: 'admin' | 'candidate' | 'employer'; name?: string; verified: boolean; rejectionReason?: string; };
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, resetLoading } = authSlice.actions;
export default authSlice.reducer;