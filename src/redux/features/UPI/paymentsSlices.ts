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
      const newData = [...state.data];
      const newKeys = [...state.keys];
      data.forEach((item) => {
        const details = item.details?.trim();
        if (details) {
          const idx = newKeys.indexOf(details);
          if (idx === -1) {
            newKeys.push(details);
            newData.push(item);
          } else {
            // Already present them overide the preview
            newData[idx] = item;
          }
        }
      });
      return { ...state, keys: newKeys, data: newData };
    },
    resetPaymentSlice: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRows, resetPaymentSlice } = paymentsSlice.actions;

export default paymentsSlice;
