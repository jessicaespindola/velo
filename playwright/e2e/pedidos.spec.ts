import { test, expect } from '@playwright/test'

// AAA - Arrange, Act, Assert(melhor padrão de automação) - Preparar, Agir, Assertar/verificar

test('deve consultar um pedido aprovado', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/')

  // Checkpoint 
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  // Acessar a página de consulta de pedidos
  // xpatch a[text()="Consultar Pedido"]
  // cssSelector a[href="/lookup"]
  // Act
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()

  // Verificar se a página de consulta de pedidos foi carregada
  // Act
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  await page.getByTestId('search-order-id').dblclick()
  await page.getByTestId('search-order-id').fill('VLO-P3PW2P')
  await page.getByTestId('search-order-button').click()

  // Verificar se o pedido foi encontrado
  // Assert
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-P3PW2P')
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
})