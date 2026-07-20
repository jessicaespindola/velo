import { test, expect } from '../support/fixtures'
import { deleteOrdersByCustomerEmail } from '../support/database/orderRepository'


test.describe('Checkout', () => {


  test.describe('Validações de campos obrigatórios', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    })

    test('deve validar obrigatoriedade de todos os campos com formulário em branco', async ({ page, app }) => {
      //ACT
      await app.checkout.submit()

      //Assert
      await expect(
        app.checkout.elements.alerts.name
      ).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(
        app.checkout.elements.alerts.lastname
      ).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(
        app.checkout.elements.alerts.email
      ).toHaveText('Email inválido')
      await expect(
        app.checkout.elements.alerts.phone
      ).toHaveText('Telefone inválido')
      await expect(
        app.checkout.elements.alerts.document
      ).toHaveText('CPF inválido')
      await expect(
        app.checkout.elements.alerts.store
      ).toHaveText('Selecione uma loja')
      await expect(
        app.checkout.elements.alerts.terms
      ).toHaveText('Aceite os termos')
    })

    test('deve validar limite de caracteres para nome e sobrenome', async ({ page, app }) => {


      const customer = {
        name: 'A',
        lastname: 'B',
        email: 'cliente@email.com',
        phone: '(11) 99999-9999',
        document: '12345678900',
      }
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      //ACT
      await app.checkout.submit()

      //Assert
      await expect(
        app.checkout.elements.alerts.name
      ).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(
        app.checkout.elements.alerts.lastname
      ).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir mensagem de erro para e-mail inválido', async ({ page, app }) => {

      const customer = {
        name: 'Jéssica',
        lastname: 'Silva',
        email: 'cliente@.com',
        phone: '(11) 99999-9999',
        document: '12345678900',
      }
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      //ACT
      await app.checkout.submit()

      await expect(
        app.checkout.elements.alerts.email
      ).toHaveText('Email inválido')
    })

    test('deve exibir mensagem de erro para CPF inválido', async ({ page, app }) => {

      const customer = {
        name: 'Jéssica',
        lastname: 'Silva',
        email: 'cliente@gmail.com',
        phone: '(11) 99999-9999',
        document: '00000014199',
      }
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      //ACT
      await app.checkout.submit()

      await expect(
        app.checkout.elements.alerts.document
      ).toHaveText('CPF inválido')
    })

    test('deve exigir aceite dos termos com demais campos válidos', async ({ page, app }) => {

      const customer = {
        name: 'Jéssica',
        lastname: 'Silva',
        email: 'cliente@gmail.com',
        phone: '(11) 99999-9999',
        document: '529.982.247-25',
      }
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await expect(app.checkout.elements.terms).not.toBeChecked()

      //ACT
      await app.checkout.submit()

      await expect(
        app.checkout.elements.alerts.terms
      ).toHaveText('Aceite os termos')
    })
  })

  test.describe('Pagamento à vista', () => {

    test('deve criar pedido aprovado com pagamento à vista', async ({ page, app }) => {
      const customer = {
        name: 'Carlos',
        lastname: 'Mendes',
        email: 'carlos.mendes@email.com',
        phone: '(11) 98888-7777',
        document: '529.982.247-25',
        payment: 'À vista',
      }
      const store = 'Velô Paulista'
      const total = 'R$ 40.000,00'

      // Arrange
      await deleteOrdersByCustomerEmail(customer.email) //deletar pedidos de execuções anteriores
      await page.goto('/')
      await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
      await page.getByRole('link', { name: /Configure Agora/i }).click()

      await app.configurator.selectColor('Glacier Blue')
      await app.configurator.selectWheels(/Aero Wheels/)
      await app.configurator.expectPrice(total)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectCashPayment()
      await app.checkout.expectCashPaymentTotal(total)
      await app.checkout.expectSummaryTotal(total)
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await app.checkout.expectOrderApproved({
        fullName: `${customer.name} ${customer.lastname}`,
        email: customer.email,
        store: 'Velô Paulista - Av. Paulista, 1000',
        total,
      })
    })

    test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento', async ({ page, app }) => {
      const customer = {
        name: 'Jeremias',
        lastname: 'Alcântara',
        email: 'jeremias.alcantara@email.com',
        phone: '(11) 97777-6666',
        document: '293.655.810-79',
        payment: 'Financiamento',
      }
      const store = 'Velô Paulista'
      const total = 'R$ 40.000,00'

      // Arrange
      await deleteOrdersByCustomerEmail(customer.email) //deletar pedidos de execuções anteriores

      //listener - um ouvinte para a requisição
      // é consumido após o submit ser enviado para a API
      await page.route('**/functions/v1/credit-analysis', async route => {
        return route.fulfill({ // troca o valor que é retornado pela requisição, não traz o score real
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'Done',
            score: 710
          }),
        })
      })

      await page.goto('/')
      await page.getByRole('link', { name: /Configure Agora/i }).click()

     // await app.configurator.selectColor('Glacier Blue')
     // await app.configurator.selectWheels(/Aero Wheels/)
      await app.configurator.expectPrice(total)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      
      await app.checkout.selectFinancedPayment()
      await app.checkout.acceptTerms()
      await app.checkout.submit()
    })

    test('deve encaminhar para análise quando o score do CPF estiver entre 501 e 700 no financiamento', async ({ page, app }) => {
      const customer = {
        name: 'Marina',
        lastname: 'Oliveira',
        email: 'marina.oliveira@email.com',
        phone: '(11) 96666-5555',
        document: '866.616.580-45',
        payment: 'Financiamento',
      }
      const store = 'Velô Paulista'
      const total = 'R$ 40.000,00'

      // Arrange
      await deleteOrdersByCustomerEmail(customer.email)

      await page.route('**/functions/v1/credit-analysis', async route => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'Done',
            score: 600,
          }),
        })
      })

      await page.goto('/')
      await page.getByRole('link', { name: /Configure Agora/i }).click()

      await app.configurator.expectPrice(total)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectFinancedPayment()
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(page).toHaveURL(/\/success/)
      const orderId = await page.getByTestId('order-id').textContent()
      expect(orderId).toMatch(/^VLO-[A-Z0-9]{6}$/)

      await page.getByTestId('goto-consultar').click()
      await app.orderLookup.searchOrder(orderId!)
      await app.orderLookup.validateStatusBadge('EM_ANALISE')
    })
  })
})
