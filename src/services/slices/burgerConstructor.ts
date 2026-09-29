import { orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient, TOrder, TConstructorIngredient } from '../../utils/types';
import { RootState } from '../store';

export const orderBurgerThunk = createAsyncThunk(
  'burgerConstructor/orderBurger',
  (data: string[]) => orderBurgerApi(data)
);

interface IBurgerConstrucrorSlice {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IBurgerConstrucrorSlice = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },

    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    reorderIngredients: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const [movedItem] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, movedItem);
    }
  },

  extraReducers: (builder) => {
    builder.addCase(orderBurgerThunk.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(orderBurgerThunk.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = {
        ...(action.payload as any).order,
        ingredients: []
      };
      state.bun = null;
      state.ingredients = [];
    });
    builder.addCase(orderBurgerThunk.rejected, (state, action) => {
      state.orderRequest = false;
    });
  }
});

export const {
  closeOrderModal,
  addBun,
  addIngredient,
  removeIngredient,
  reorderIngredients
} = burgerConstructorSlice.actions;

export const selectConstructorItems = (state: RootState) => ({
  bun: state.burgerConstructor.bun,
  ingredients: state.burgerConstructor.ingredients
});
export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export default burgerConstructorSlice.reducer;
