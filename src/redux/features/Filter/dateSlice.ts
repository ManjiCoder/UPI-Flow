import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = {
  yearMonth: format(new Date(), 'yyyy-MM'),
};
const dateSlice = createSlice({
  name: 'dateSlice',
  initialState,
  reducers: {},
});

export default dateSlice.reducer;
