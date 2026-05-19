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
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  // Act
  await page.getByLabel('Número do Pedido').fill('VLO-P3PW2P')
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()


  // Verificar se o pedido foi encontrado
  // Assert
  await expect(page.getByRole('textbox', { name: 'Número do Pedido' })).toBeVisible();
  await expect(page.getByText('APROVADO')).toBeVisible();
})