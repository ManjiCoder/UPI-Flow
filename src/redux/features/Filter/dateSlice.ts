import { FilterOption, Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addMonths, format, subMonths } from 'date-fns';

interface dateSliceState {
  dateFilter: string;
  filterData:
    | {
        [timeStamp: string]: Transaction[];
      }
    | {};
  filter: FilterOption;
  expense: number;
  income: number;
  balance: number;
}

const initialState: dateSliceState = {
  dateFilter: format(new Date(), 'yyyy-MM'),
  filterData: {},
  filter: FilterOption.Monthly,
  expense: 0,
  income: 0,
  balance: 0,
};

const dateSlice = createSlice({
  name: 'dateSlice',
  initialState,
  reducers: {
    incrementDateFilter: (state) => {
      const dateFilter = format(
        addMonths(new Date(state.dateFilter), 1),
        'yyyy-MM'
      );
      state.dateFilter = dateFilter;
    },
    decrementDateFilter: (state) => {
      const dateFilter = format(
        subMonths(new Date(state.dateFilter), 1),
        'yyyy-MM'
      );
      state.dateFilter = dateFilter;
    },
    setDateFiler: (state, action) => {
      state.filter = action.payload;
    },
    setFilterData: (state, action: PayloadAction<Transaction[]>) => {
      const data = action.payload;
      const filterData = data.filter(({ date }) =>
        date.includes(state.dateFilter)
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
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const {
  incrementDateFilter,
  decrementDateFilter,
  setDateFiler,
  setFilterData,
  setFilter,
} = dateSlice.actions;
export default dateSlice.reducer;
