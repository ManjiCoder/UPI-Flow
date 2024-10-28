import { Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addMonths, format, subMonths } from 'date-fns';

interface dateSliceState {
  yearMonth: string;
  filterData:
    | {
        [timeStamp: string]: Transaction[];
      }
    | {};
  expense: number;
  income: number;
  balance: number;
}

const initialState: dateSliceState = {
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
      const filterData = data.filter(({ date }) =>
        date.includes(state.yearMonth)
      );
      const newData = filterData.reduce((acc, item) => {
        // @ts-ignore
        const arr = (acc[item.date] ||= []);
        arr.push(item);
        return acc;
      }, {});
      state.filterData = newData;
      const totalIncome = filterData
        .map(({ credit }) => credit)
        .filter(Boolean)
        .reduce((x, y) => {
          // @ts-ignore
          return x + y;
        }, 0) as number;
      const totalExpense = filterData
        .map(({ debit }) => debit)
        .filter(Boolean)
        .reduce((x, y) => {
          // @ts-ignore
          return x + y;
        }, 0) as number;
      const totalBalance = (totalIncome || 0) - (totalExpense || 0);
      state.income = totalIncome;
      state.expense = totalExpense;
      state.balance = totalBalance;
    },
  },
});

export const { incrementYearMonth, decrementYearMonth, setFilterData } =
  dateSlice.actions;
export default dateSlice.reducer;
