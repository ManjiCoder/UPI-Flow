import { FilterOption } from '@/types/constant';
import { createSlice } from '@reduxjs/toolkit';

const initialState = { filter: FilterOption.Monthly };
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const key = action.payload;
      // @ts-ignore
      state.filter = FilterOption[key];
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
