import {expect, test, describe} from '@jest/globals'
import ingredientsReducer, {getIngredientsThunk} from '../ingredients'

const expectedIngredients = [
  {  
  _id: '1',
  name: 'булка',
  type: 'bunn',
  proteins: 12,
  fat: 99,
  carbohydrates: 100,
  calories: 100,
  price: 100,
  image: 'path1',
  image_large: 'path2',
  image_mobile: 'path3',},
  {  
  _id: '2',
  name: 'ингридиент',
  type: 'ingredient',
  proteins: 99,
  fat: 999,
  carbohydrates: 999,
  calories: 999,
  price: 3000,
  image: 'path1',
  image_large: 'path2',
  image_mobile: 'path3'}
]

const initialState = {
      ingredients: [],
      isLoading: false,
      error: null
    }

describe('Тестирование редюсера ingredients', () => {

  test('1. Экшен, не существующий в приложении', () => {
    const result = ingredientsReducer(undefined, {type: 'UNKNOWN'});
    expect(result).toEqual(initialState);
  })

  test('2. Тестирование ассинхронного экшена getIngredientsThunk. Успешное выполнение (fulfilled)', ()=>{
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: expectedIngredients
    }
    const expectedResult = {
      ingredients: expectedIngredients,
      isLoading: false,
      error: null
    }
    const result = ingredientsReducer(initialState, action);
    expect(result).toEqual(expectedResult)
  })

  test('3. Тестирование ассинхронного экшена getIngredientsThunk. Загрузка (pending)', ()=>{
    const action = {
      type: getIngredientsThunk.pending.type
    }
    const expectedResult = {
      ingredients: [],
      isLoading: true,
      error: null
    }
    const result = ingredientsReducer(initialState, action);
    expect(result).toEqual(expectedResult)
  })

  test('4. Тестирование ассинхронного экшена getIngredientsThunk. Ошибка (rejected)', ()=>{
    const errorMessage = 'Ошибка загрузки ингредиентов с сервера';
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: {message: errorMessage}
    }
    const expectedResult = {
      ingredients: [],
      isLoading: false,
      error: errorMessage
    }
    const result = ingredientsReducer(initialState, action);
    expect(result).toEqual(expectedResult)
  })
})

