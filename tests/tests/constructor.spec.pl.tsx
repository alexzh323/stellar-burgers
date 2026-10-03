import { test, expect } from '@playwright/test';

test.describe('Интеграционные тесты', () => {
  test.beforeEach(async({page}) => {
    await page.routeFromHAR('tests/mocks/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
  });

  test('1. проверка добавления булки и основного ингридиента с помощью HAR-файла', async({page}) => {

    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    const bunContainer = page.locator('li', {hasText: 'Краторная булка N-200i'})
    await bunContainer.getByRole('button', {name: 'Добавить'}).click();

    const ingredientContainer = page.locator('li', {hasText: 'Биокотлета из марсианской Магнолии'})
    await ingredientContainer.getByRole('button', {name: 'Добавить'}).click();

    const bunConstructorSection = page.locator('.constructor-element_pos_top')
    const ingredientConstructorSection = page.locator('.constructor-element:not(.constructor-element_pos_top):not(.constructor-element_pos_bottom)');
    //такой селектор поможет тесту поймать баг, при котором обычный ингридиент встанет на место булки
    await expect(bunConstructorSection.filter({hasText: 'Краторная булка N-200i'})).toBeVisible();
    await expect(ingredientConstructorSection.filter({hasText: 'Биокотлета из марсианской Магнолии'})).toBeVisible();
  })

  test('2. Проверка открытия и закрытия модальных окон', async({page}) => {

    await page.goto('/');

    const bunContainer = page.locator('a', {hasText: 'Краторная булка N-200i'});
    await bunContainer.click();

    const modalHeading = page.locator('h3', {hasText: 'Детали ингредиента'});
    const modalIngredientName = page.locator('#modals h3', {hasText: 'Краторная булка N-200i'});
    await expect(modalHeading).toBeVisible();
    await expect(modalIngredientName).toBeVisible();

    const closeButton = page.locator('#modals button');
    await closeButton.click();
    await expect(modalHeading).not.toBeVisible();

    const overlay = page.getByTestId('overlay')
    await bunContainer.click();
    await overlay.click({position: { x: 10, y: 10 }});
    await expect(modalHeading).not.toBeVisible();
  })

  test('3. Проверка оформления заказа', async({page, context}) => {

    await page.routeFromHAR('tests/mocks/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('tests/mocks/order.har', {
      url: '**/api/orders',
      update: false
    })

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fakeAccessToken',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await context.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fakeRefreshToken');
    })

    await page.goto('/');

    const bunContainer = page.locator('li', {hasText: 'Краторная булка N-200i'})
    await bunContainer.getByRole('button', {name: 'Добавить'}).click();

    const ingredientContainer = page.locator('li', {hasText: 'Биокотлета из марсианской Магнолии'})
    await ingredientContainer.getByRole('button', {name: 'Добавить'}).click();

    const orderButton = page.locator('button', {hasText: 'Оформить заказ'});
    await orderButton.click();

    const orderNumber = page.getByText('110886')
    await expect(orderNumber).toBeVisible();

    const closeButton = page.locator('#modals button');
    await closeButton.click();
    await expect(orderNumber).not.toBeVisible();

    const bunConstructorSection = page.locator('.constructor-element_pos_top')
    const ingredientConstructorSection = page.locator('.constructor-element:not(.constructor-element_pos_top):not(.constructor-element_pos_bottom)');
    await expect(bunConstructorSection).not.toBeVisible();
    await expect (ingredientConstructorSection).not.toBeVisible();
  })
})
