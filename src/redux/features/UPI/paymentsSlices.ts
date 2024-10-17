import { createSlice } from '@reduxjs/toolkit';

export interface PaymentsState {
  date: string;
}

const initialState: PaymentsState = {
  date: '0',
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    increment: (state) => {
      console.log(state);
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      //   state.value += 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment } = paymentsSlice.actions;

export default paymentsSlice;
