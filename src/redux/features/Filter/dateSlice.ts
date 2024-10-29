import { FilterOption, Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
FilterOption.Daily;
interface dateSliceState {
  dateFilter: string;
  filterData:
    | {
        [timeStamp: string]: Transaction[];
      }
    | {};
  filter: {
    name: string;
    format: string;
  };
  expense: number;
  income: number;
  balance: number;
}

const initialState: dateSliceState = {
  dateFilter: new Date().toISOString(),
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
      const key = state.filter;
      console.log(key);
    },
    decrementDateFilter: (state) => {},
    setFilterData: (state, action: PayloadAction<Transaction[]>) => {
      const data = action.payload;
      const dateFilterStr = format(state.dateFilter, 'yyyy-MM');
      const filterData = data.filter(({ date }) =>
        date.includes(dateFilterStr)
      );
      // console.log(filterData);
      const newData = filterData.reduce((acc, item) => {
        // @ts-ignore
        const arr = (acc[item.date] ||= []);
        arr.push(item);
        return acc;
      }, {});

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

      state.filterData = newData;
      state.income = totalIncome;
      state.expense = totalExpense;
      state.balance = totalBalance;
    },
    setFilter: (state, action) => {
      const key = action.payload;
      state.filter = FilterOption[key];
    },
  },
});

export const {
  incrementDateFilter,
  decrementDateFilter,
  setFilterData,
  setFilter,
} = dateSlice.actions;
export default dateSlice.reducer;
