import { Page, expect } from '@playwright/test'

export function createHeroActions(page: Page) {
  async function open() {
    await page.goto('/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  }

  async function startConfigure() {
    await page.getByRole('link', { name: /Configure Agora/i }).click()
  }

  return {
    open,
    startConfigure,
    async openAndConfigure() {
      await open()
      await startConfigure()
    },
  }
}
