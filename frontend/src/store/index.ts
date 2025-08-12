import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import candidateReducer from './slices/candidateSlices';
import employerReducer from './slices/employerSlice';

interface AuthState {
  user: { userId: string; role: 'admin' | 'candidate' | 'employer'; name?: string; verified: boolean } | null; // Added verified
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

interface CandidateState {
  candidates: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

interface EmployerState {
  employers: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

interface RootState {
  auth: AuthState;
  candidates: CandidateState;
  employers: EmployerState;
}

type RootReducer = {
  auth: typeof authReducer;
  candidates: typeof candidateReducer;
  employers: typeof employerReducer;
};

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers<RootReducer>({
  auth: authReducer,
  candidates: candidateReducer,
  employers: employerReducer,
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type { RootState };

export default store;