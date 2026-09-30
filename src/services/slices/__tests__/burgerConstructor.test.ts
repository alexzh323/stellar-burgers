import {expect, test, describe} from '@jest/globals'
import burgerConstructorSlice, {closeOrderModal,
  addBun,
  addIngredient,
  removeIngredient,
  reorderIngredients,
  orderBurgerThunk} from '../burgerConstructor'

const initialState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
}

describe('Тестирование редюсера burgerConstructor', () => {
  test('1. Экшен, не существующий в приложении', () => {
    const result = burgerConstructorSlice(undefined, {type: 'UNKNOWN'});
    expect(result).toEqual(initialState);
  })
  test('2. Экшен closeOrderModal', () => {
    const prevState = {
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: {
        _id: 'string',
        status: 'string',
        name: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        number: 1,
        ingredients: ['string', 'string']}
    }
    const result = burgerConstructorSlice(prevState, closeOrderModal());
    expect(result).toEqual({...prevState, orderModalData: null});
  })
  test('3. Экшен addBun (добавлене и замена булки)', () => {
    const mockBunCurrent = {
    _id: '1',
    name: 'Булка 1',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string'
    }

    const mockBunNext = {
    _id: '2',
    name: 'Булка 2',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string'
    }

    const newBunResult = burgerConstructorSlice(initialState, addBun(mockBunCurrent));
    expect(newBunResult).toEqual({...initialState, bun: mockBunCurrent});

    const changeBunResult = burgerConstructorSlice({...initialState, bun: mockBunCurrent}, addBun(mockBunNext));
    expect(changeBunResult).toEqual({...initialState, bun: mockBunNext});
  })
  test('4. Экшен addIngredient (последовательное добавлене 2-х ингредиентов)', () => {
    const mockIngredient = {
    _id: '1',
    name: 'Соус 1',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string'
    }

    const stepOneResult = burgerConstructorSlice(initialState, addIngredient(mockIngredient));
    expect(stepOneResult.ingredients).toEqual([{...mockIngredient, id: expect.any(String)}]);

    const stepTwoResult = burgerConstructorSlice(stepOneResult, addIngredient(mockIngredient));
    expect(stepTwoResult.ingredients).toEqual([{...mockIngredient, id: expect.any(String)}, {...mockIngredient, id: expect.any(String)}]);
  })
  test('5. Экшен removeIngredient (проверяем, что удалён только выбранный ингридиент)', () => {
    const mockIngredients = [{
    _id: '1',
    name: 'Соус 1',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '1'},

    {
    _id: '1',
    name: 'Соус 1',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '2'
  }]

    const prevState = {
      bun: null,
      ingredients: mockIngredients,
      orderRequest: false,
      orderModalData: null
    }
    const result = burgerConstructorSlice(prevState, removeIngredient('2'));
    expect(result.ingredients).not.toContainEqual(expect.objectContaining({id: '2'}));
    expect(result.ingredients).toContainEqual(expect.objectContaining({id: '1'}));
  })

  test('6. Экшен reorderIngredients', () => {
    const mockIngredients = [{
    _id: '1',
    name: 'Соус 1',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '1'},

    {
    _id: '2',
    name: 'Соус 2',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '2'
  },
  {
    _id: '3',
    name: 'Соус 3',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '3'
  }]

  const prevState = {
    bun: null,
    ingredients: mockIngredients,
    orderRequest: false,
    orderModalData: null
  }

  const expectedResult = [{
    _id: '2',
    name: 'Соус 2',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '2'
  },
  {
   _id: '1',
    name: 'Соус 1',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '1'},
  {
    _id: '3',
    name: 'Соус 3',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '3'
  }]

  const result = burgerConstructorSlice(prevState, reorderIngredients({from:0, to:1}));
  expect(result.ingredients).toEqual(expectedResult);
  })

  test('7. Ассинхронный экшен orderBurgerThunk. Загрузка (pending)', () => {
    const action = {type: orderBurgerThunk.pending.type};
    const result = burgerConstructorSlice(initialState, action);
    expect(result.orderRequest).toBe(true);
  })

  test('8. Ассинхронный экшен orderBurgerThunk. Ошибка (rejected)', () => {
    const prevState = {
      bun: null,
      ingredients: [],
      orderRequest: true,
      orderModalData: null
    } 
    const action = {type: orderBurgerThunk.rejected.type};
    const result = burgerConstructorSlice(prevState, action);
    expect(result.orderRequest).toBe(false);
  })
  
  test('9. Ассинхронный экшен orderBurgerThunk. Успешное выполнение (fulfilled)', () => {
   
    const mockBun = {
    _id: '1',
    name: 'Булка 1',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string'
    }

    const mockIngredients = [{
    _id: '1',
    name: 'Соус 1',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '1'},

    {
    _id: '2',
    name: 'Соус 2',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '2'
  },
  {
    _id: '3',
    name: 'Соус 3',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 2,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '3'
  }]

  const mockOrderResponse = {
      _id: 'string',
      status: 'string',
      name: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      number: 1,
    }

    const action = {
      type: orderBurgerThunk.fulfilled.type,
      payload: {order: mockOrderResponse}
    }
    
    const prevState = {
      bun: mockBun,
      ingredients: mockIngredients,
      orderRequest: true,
      orderModalData: null
    }

    const expectedState = {
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: {...mockOrderResponse, ingredients: []}
    }

    const result = burgerConstructorSlice(prevState, action)
    expect(result).toEqual(expectedState);
  })
})