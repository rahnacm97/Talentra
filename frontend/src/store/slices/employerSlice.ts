
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Employer } from '../../types/employer';

// export interface Employer {
//   _id: string;
//   email: string;
//   password: string;
//   googleId: string;
//   name: string;
//   phoneNumber: string;
//   companyDescription?: string;
//   website?: string;
//   location?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   blocked: boolean;
//   verified: boolean;
//   organizationType: string;
//   yearEstablishment: Date;
//   regId: string;
//   teamSize: string;
//   industryType: string;
//   rejectionReason?: string; 
// }

export interface EmployerState {
  employers: Employer[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: EmployerState = {
  employers: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

const employerSlice = createSlice({
  name: 'employers',
  initialState,
  reducers: {
    fetchEmployersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployersSuccess: (state, action: PayloadAction<{ data: Employer[]; totalPages: number }>) => {
      state.loading = false;
      state.employers = action.payload.data;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    },
    fetchEmployersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateEmployerBlock: (state, action: PayloadAction<{ id: string; blocked: boolean }>) => {
      const employer = state.employers.find((e) => e._id === action.payload.id);
      if (employer) {
        employer.blocked = action.payload.blocked;
      }
    },
    updateEmployer: (state, action: PayloadAction<{ id: string; updateData: Partial<Employer> }>) => {
      const employer = state.employers.find((e) => e._id === action.payload.id);
      if (employer) {
        Object.assign(employer, action.payload.updateData);
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    verifyEmployer: (state, action: PayloadAction<string>) => {
      const employer = state.employers.find((e) => e._id === action.payload);
      if (employer) {
        employer.verified = true;
        employer.rejectionReason = undefined;
      }
    },
    rejectEmployer: (state, action: PayloadAction<{ id: string; rejectionReason: string }>) => {
      const employer = state.employers.find((e) => e._id === action.payload.id);
      if (employer) {
        employer.verified = false;
        employer.rejectionReason = action.payload.rejectionReason;
      }
    },
  },
});

export const {
  fetchEmployersStart,
  fetchEmployersSuccess,
  fetchEmployersFailure,
  updateEmployerBlock,
  setCurrentPage,
  updateEmployer,
  verifyEmployer,
  rejectEmployer,
} = employerSlice.actions;
export default employerSlice.reducer;