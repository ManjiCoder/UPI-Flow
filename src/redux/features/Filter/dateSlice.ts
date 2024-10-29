import { FilterOption, Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
FilterOption.Daily;
interface dateSliceState {
  dateFilter: string;
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
  dateFilter: new Date().toISOString(),
  filterData: {},
  expense: 0,
  income: 0,
  balance: 0,
};

const dateSlice = createSlice({
  name: 'dateSlice',
  initialState,
  reducers: {
    incrementDateFilter: (state, action) => {
      const key = action.payload;
      let newDate;
      switch (key) {
        case FilterOption.Daily.name:
          newDate = addDays(new Date(state.dateFilter), 1).toISOString();
          break;
        case FilterOption.Weekly.name:
          newDate = addWeeks(new Date(state.dateFilter), 1).toISOString();
          newDate = startOfWeek(newDate, { weekStartsOn: 0 }).toISOString();
          break;
        case FilterOption.ThreeMonths.name:
          newDate = addMonths(new Date(state.dateFilter), 3).toISOString();
          break;
        case FilterOption.SixMonths.name:
          newDate = addMonths(new Date(state.dateFilter), 6).toISOString();
          break;
        case FilterOption.Yearly.name:
          newDate = addYears(new Date(state.dateFilter), 1).toISOString();
          break;

        default:
          newDate = addMonths(new Date(state.dateFilter), 1).toISOString();
          break;
      }
      state.dateFilter = newDate;
    },
    decrementDateFilter: (state, action) => {
      const key = action.payload;
      let newDate;
      switch (key) {
        case FilterOption.Daily.name:
          newDate = subDays(new Date(state.dateFilter), 1).toISOString();
          break;
        case FilterOption.Weekly.name:
          newDate = subWeeks(new Date(state.dateFilter), 1).toISOString();
          newDate = startOfWeek(newDate, { weekStartsOn: 0 }).toISOString();
          break;
        case FilterOption.ThreeMonths.name:
          newDate = subMonths(new Date(state.dateFilter), 3).toISOString();
          break;
        case FilterOption.SixMonths.name:
          newDate = subMonths(new Date(state.dateFilter), 6).toISOString();
          break;
        case FilterOption.Yearly.name:
          newDate = subYears(new Date(state.dateFilter), 1).toISOString();
          break;

        default:
          newDate = subMonths(new Date(state.dateFilter), 1).toISOString();
          break;
      }
      state.dateFilter = newDate;
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
  },
});

export const { incrementDateFilter, decrementDateFilter, setFilterData } =
  dateSlice.actions;
export default dateSlice.reducer;
