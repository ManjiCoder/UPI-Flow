import { FilterOption, Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  subMonths,
} from 'date-fns';

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
  dateFilter: format(new Date(), 'MMMM, yyyy'),
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
      let newDate;
      switch (state.filter) {
        case FilterOption.Daily:
          newDate = format(
            addDays(new Date(state.dateFilter), 1),
            'MMM dd, yyyy'
          );
          break;
        case FilterOption.Weekly:
          newDate = format(addWeeks(new Date(state.dateFilter), 1), 'MMM dd');
          break;
        case FilterOption.ThreeMonths:
          newDate = format(addMonths(new Date(state.dateFilter), 3), 'MMM');
          break;
        case FilterOption.SixMonths:
          newDate = format(addMonths(new Date(state.dateFilter), 6), 'MMM');
          break;
        case FilterOption.Yearly:
          newDate = format(addYears(new Date(state.dateFilter), 1), 'yyyy');
          break;
        default:
          newDate = format(addWeeks(new Date(state.dateFilter), 1), 'yyyy-MM');
          break;
      }
      console.log(newDate);
      state.dateFilter = newDate;
    },
    decrementDateFilter: (state) => {
      const newDate = format(
        subMonths(new Date(state.dateFilter), 1),
        'yyyy-MM'
      );
      state.dateFilter = newDate;
    },
    setDateFiler: (state, action) => {
      state.filter = action.payload;
    },
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
