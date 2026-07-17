import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  return {
    async expectLoaded() {
      await expect(page).toHaveURL(/\/order/)
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async expectSummaryTotal(price: string) {
      const summaryTotal = page.getByTestId('summary-total-price')
      await expect(summaryTotal).toBeVisible()
      await expect(summaryTotal).toHaveText(price)
    },
  }
}
