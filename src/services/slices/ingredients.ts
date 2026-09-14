import { getIngredientsApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TIngredient } from '../../utils/types'
import { RootState } from "../store";

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  () => {
    return getIngredientsApi();
  }
)

interface IIngredientSlice {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IIngredientSlice = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const ingridientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase((getIngredientsThunk.pending), (state) => {
      state.isLoading = true;
    });
    builder.addCase((getIngredientsThunk.fulfilled), (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
    builder.addCase((getIngredientsThunk.rejected), (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки ингредиентов';
    });
  }
});

export const selectIngredientsLoading = (state: RootState) => state.ingredients.isLoading;
export const selectIngredientsData = (state: RootState) => state.ingredients.ingredients;
export const selectIngredientsError = (state: RootState) => state.ingredients.error;

export default ingridientSlice.reducer;