import { Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addMonths, format, subMonths } from 'date-fns';

const initialState = {
  yearMonth: format(new Date(), 'yyyy-MM'),
  filterData: {},
  expense: 0,
  income: 0,
  balance: 0,
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
    setFilterData: (state, action: PayloadAction<Transaction[]>) => {
      const data = action.payload;
      const newData = data
        .filter(({ date }) => date.includes(state.yearMonth))
        .reduce((acc, item) => {
          // @ts-ignore
          const arr = (acc[item.date] ||= []);
          arr.push(item);
          return acc;
        }, {});
      state.filterData = newData;
    },
  },
});

export const { incrementYearMonth, decrementYearMonth, setFilterData } =
  dateSlice.actions;
export default dateSlice.reducer;
