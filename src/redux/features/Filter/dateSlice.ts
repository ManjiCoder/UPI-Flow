import { createSlice } from '@reduxjs/toolkit';
import { addMonths, format, subMonths } from 'date-fns';

const initialState = {
  yearMonth: format(new Date(), 'yyyy-MM'),
  data: [],
};

const dateSlice = createSlice({
  name: 'dateSlice',
  initialState,
  reducers: {
    incrementYearMonth: (state) => {
      const newYearMonth = format(
        addMonths(new Date(state.yearMonth), 1),
        'yyyy-MM'
      );
      state.yearMonth = newYearMonth;
    },
    decrementYearMonth: (state) => {
      const newYearMonth = format(
        subMonths(new Date(state.yearMonth), 1),
        'yyyy-MM'
      );
      state.yearMonth = newYearMonth;
    },
  },
});

export const { incrementYearMonth, decrementYearMonth } = dateSlice.actions;
export default dateSlice.reducer;
