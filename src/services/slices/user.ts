import {
  getUserApi,
  updateUserApi,
  TRegisterData,
  getOrdersApi,
  registerUserApi,
  logoutApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser, TOrder } from '../../utils/types';
import { RootState } from '../store';
import { loginUserApi, TLoginData } from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export const getUserApiThunk = createAsyncThunk('user/getUser', () =>
  getUserApi()
);

export const updateUserApiThunk = createAsyncThunk(
  'user/updateUser',
  (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const loginUserApiThunk = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response;
  }
);

export const registerUserApiThunk = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response;
  }
);

export const logoutUserApiThunk = createAsyncThunk(
  'user/logoutUser',
  async () => {
    const response = await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    return response;
  }
);

export const getProfileOrdersThunk = createAsyncThunk(
  'user/getProfileOrders',
  () => getOrdersApi()
);

interface IUserState {
  user: TUser | null;
  orders: TOrder[];
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  orders: [],
  isLoading: false,
  isAuthChecked: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.user = action.payload.user;
    });
    builder.addCase(getUserApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.error = action.error.message || 'Ошибка загрузки пользователя';
    });

    builder.addCase(updateUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
    builder.addCase(updateUserApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка обновления профиля';
    });

    builder.addCase(loginUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUserApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.user = action.payload.user;
    });
    builder.addCase(loginUserApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка авторизации';
    });

    builder.addCase(registerUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUserApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.user = action.payload.user;
    });
    builder.addCase(registerUserApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка авторизации';
    });

    builder.addCase(getProfileOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProfileOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(getProfileOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки истории заказов';
    });

    builder.addCase(logoutUserApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutUserApiThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.orders = [];
    });
    builder.addCase(logoutUserApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка выхода из системы';
    });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectUserError = (state: RootState) => state.user.error;
export const selectProfoleOrders = (state: RootState) => state.user.orders;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export default userSlice.reducer;
