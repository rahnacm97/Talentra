import { createSlice, } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Candidate } from '../../types/candidate';

// interface Candidate {
//   _id: string;
//   email: string;
//   name: string;
//   resume?: string;
//   skills: string[];
//   experience: { company: string; role: string; startDate: Date; endDate?: Date }[];
//   education: { institution: string; degree: string; startDate: Date; endDate?: Date }[];
//   jobPreferences: { location?: string; jobType?: 'full-time' | 'part-time' | 'contract' | 'remote'; salaryExpectation?: number };
//   createdAt: Date;
//   updatedAt: Date;
//   blocked: boolean;
// }

interface CandidateState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: CandidateState = {
  candidates: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    fetchCandidatesStart: (state) => { state.loading = true; state.error = null; },
    fetchCandidatesSuccess: (state, action: PayloadAction<{ data: Candidate[]; totalPages: number }>) => {
      state.loading = false;
      state.candidates = action.payload.data;
      state.totalPages = action.payload.totalPages;
    },
    fetchCandidatesFailure: (state, action: PayloadAction<string>) => { state.loading = false; state.error = action.payload; },
    updateCandidateBlock: (state, action: PayloadAction<{ id: string; blocked: boolean }>) => {
      const candidate = state.candidates.find(c => c._id === action.payload.id);
      if (candidate) candidate.blocked = action.payload.blocked;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => { state.currentPage = action.payload; },
  },
});

export const { fetchCandidatesStart, fetchCandidatesSuccess, fetchCandidatesFailure, updateCandidateBlock, setCurrentPage } = candidateSlice.actions;
export default candidateSlice.reducer;