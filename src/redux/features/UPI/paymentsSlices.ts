import { Transaction } from '@/types/constant';
import { createSlice } from '@reduxjs/toolkit';

const initialState: Transaction[] = [];

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setRows: (state, action) => {
      return action.payload;
    },
    resetPaymentSlice: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRows, resetPaymentSlice } = paymentsSlice.actions;

export default paymentsSlice;
