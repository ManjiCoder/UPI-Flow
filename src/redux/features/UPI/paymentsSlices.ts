import { Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StateProps = {
  data: Transaction[];
  keys: string[];
};
const initialState: StateProps = {
  data: [],
  keys: [],
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<Transaction[]>) => {
      const data = action.payload;
      state.data = data;
    },
    resetPaymentSlice: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRows, resetPaymentSlice } = paymentsSlice.actions;

export default paymentsSlice;
