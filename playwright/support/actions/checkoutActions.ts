import { Page, expect } from '@playwright/test'

const ORDER_RESULT = {
  APROVADO: 'Pedido Aprovado!',
  EM_ANALISE: 'Pedido em Análise!',
  REPROVADO: 'Pedido Reprovado',
} as const

type OrderResultStatus = keyof typeof ORDER_RESULT

export function createCheckoutActions(page: Page) {

  const terms = page.getByTestId('checkout-terms')

  const alerts = {
    name: page.getByTestId('error-name'),
    lastname: page.getByTestId('error-lastname'),
    email: page.getByTestId('error-email'),
    phone: page.getByTestId('error-phone'),
    document: page.getByTestId('error-document'),
    store: page.getByTestId('error-store'),
    terms: page.getByTestId('error-terms'),
  }

  return {

    elements: {
      terms,
      alerts,
    },

    async expectLoaded() {
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },
    async expectSummaryTotal(price: string) {
      await expect(page.getByTestId('summary-total-price')).toHaveText(price)
    },

    async fillCustomerData(data: {
      name: string
      lastname: string
      email: string
      phone: string
      document: string
    }) {
      await page.getByTestId('checkout-name').fill(data.name)
      await page.getByTestId('checkout-lastname').fill(data.lastname)
      await page.getByTestId('checkout-email').fill(data.email)
      await page.getByTestId('checkout-phone').fill(data.phone)
      await page.getByTestId('checkout-document').fill(data.document)
    },

    async selectStore(storeName: string) {
      await page.getByTestId('checkout-store').click()
      await page.getByRole('option', { name: storeName }).click()
    },

    async selectCashPayment() {
      await page.getByTestId('payment-avista').click()
    },

    async expectCashPaymentTotal(price: string) {
      await expect(page.getByTestId('payment-avista')).toContainText(price)
    },

    async selectFinancedPayment() {
      await page.getByTestId('payment-financiamento').click()
    },
    async selectPaymentMethod(method: string) {
      await page.getByRole('button', { name: new RegExp(method, 'i') }).click()
    },

    async fillDownPayment(value: string) {
      await page.getByTestId('input-entry-value').fill(value)
    },
    async acceptTerms() {
      await terms.check()
    },

    async submit() {
      // Evita que type="email" bloqueie o submit antes do Zod
      await page.locator('form').evaluate((form: HTMLFormElement) => {
        form.noValidate = true
      })
      await page.getByRole('button', { name: 'Confirmar Pedido' }).click()
    },

    async expectValidationError(
      field: keyof typeof alerts,
      message: string,
    ) {
      await expect(alerts[field]).toBeVisible()
      await expect(alerts[field]).toHaveText(message)
    },
    async expectStillOnCheckout() {
      await expect(page).toHaveURL(/\/order/)
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },
    async expectResult(status: OrderResultStatus) {
      await expect(page).toHaveURL(/\/success/)
      await expect(page.getByTestId('success-status')).toHaveText(ORDER_RESULT[status])
    },
    async expectOrderApproved(data: {
      fullName: string
      email: string
      store: string
      total: string
    }) {
      await expect(page).toHaveURL(/\/success/)
      await expect(page.getByTestId('success-status')).toHaveText(ORDER_RESULT.APROVADO)
      await expect(page.getByTestId('order-id')).toHaveText(/^VLO-[A-Z0-9]{6}$/)
      await expect(page.getByText(data.fullName)).toBeVisible()
      await expect(page.getByText(data.email)).toBeVisible()
      await expect(page.getByText(data.store)).toBeVisible()
      await expect(page.getByText(data.total)).toBeVisible()
    },
  }
}
