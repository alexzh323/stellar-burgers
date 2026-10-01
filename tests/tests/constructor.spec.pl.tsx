import { test, expect } from '@playwright/test';

test('1. проверка добавления булки и основного ингридиента с помощью HAR-файла', async({page}) => {
  await page.routeFromHAR('tests/mocks/ingredients.har', {
    url: '**api/ingredients',
    update: false
  })

  await page.goto('/')
  await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

  const bunContainer = page.locator('li', {hasText: 'Краторная булка N-200i'})
  await bunContainer.getByRole('button', {name: 'Добавить'}).click();

  const ingredientContainer = page.locator('li', {hasText: 'Биокотлета из марсианской Магнолии'})
  await ingredientContainer.getByRole('button', {name: 'Добавить'}).click();

  const bunConstructorSection = page.locator('.constructor-element_pos_top')
  const ingredientConstructorSection = page.locator('.constructor-element:not(.constructor-element_pos_top):not(.constructor-element_pos_bottom)')
  //такой селектор поможет тесту поймать баг, при котором обычный ингридиент встанет на место булки
  await expect(bunConstructorSection.filter({hasText: 'Краторная булка N-200i'})).toBeVisible();
  await expect(ingredientConstructorSection.filter({hasText: 'Биокотлета из марсианской Магнолии'})).toBeVisible();
})

test('2. Проверка открытия и закрытия модальных окон', async({page}) => {
    await page.routeFromHAR('tests/mocks/ingredients.har', {
    url: '**api/ingredients',
    update: false
  })

  await page.goto('/')

  const bunContainer = page.locator('a', {hasText: 'Краторная булка N-200i'});
  await bunContainer.click();
  const modalHeading = page.locator('h3', {hasText: 'Детали ингредиента'});

  await expect(modalHeading).toBeVisible()

  const closeButton = page.locator('#modals button');
  await closeButton.click();
  await expect(modalHeading).not.toBeVisible();

  const overlay = page.getByTestId('overlay')
  await bunContainer.click();
  await overlay.click({position: { x: 10, y: 10 }});
  await expect(modalHeading).not.toBeVisible();
})