import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

export const getFeedsApiThunk = createAsyncThunk('feed/getFeed', () =>
  getFeedsApi()
);

export const getOrderByNumberApiThunk = createAsyncThunk(
  'feed/getOrderByNumber',
  (number: number) => getOrderByNumberApi(number)
);

interface IFeedsState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  orderByNumber: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  orderByNumber: null,
  isLoading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeedsApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFeedsApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
    builder.addCase(getFeedsApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки заказов';
    });

    builder.addCase(getOrderByNumberApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOrderByNumberApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orderByNumber = action.payload.orders[0];
    });
    builder.addCase(getOrderByNumberApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки заказа';
    });
  }
});

export const selectOrders = (state: RootState) => state.feed.orders;
export const selectFeed = (state: RootState) => state.feed;
export const selectOrderByNumber = (state: RootState) =>
  state.feed.orderByNumber;

export default feedSlice.reducer;
