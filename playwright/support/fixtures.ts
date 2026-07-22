import { test as base } from '@playwright/test'
import { createCheckoutActions } from './actions/checkoutActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createHeroActions } from './actions/heroActions'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createCreditAnalysisMock } from './mocks/creditAnalysisMock'

type App = {
  hero: ReturnType<typeof createHeroActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  checkout: ReturnType<typeof createCheckoutActions>
  mocks: {
    creditAnalysis: ReturnType<typeof createCreditAnalysisMock>
  }
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      hero: createHeroActions(page),
      orderLookup: createOrderLookupActions(page),
      configurator: createConfiguratorActions(page),
      checkout: createCheckoutActions(page),
      mocks: {
        creditAnalysis: createCreditAnalysisMock(page),
      },
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'
