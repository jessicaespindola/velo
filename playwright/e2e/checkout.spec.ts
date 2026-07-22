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

  test.describe('Pagamento e Confirmação', () => {
    const total = 'R$ 40.000,00'
    const store = 'Velô Paulista'

    test.beforeEach(async ({ app }) => {
      await app.hero.openAndConfigure()
      await app.configurator.expectPrice(total)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()
    })

    test('deve criar pedido aprovado com pagamento à vista', async ({ app }) => {
      const customer = {
        name: 'Carlos',
        lastname: 'Mendes',
        email: 'carlos.mendes@email.com',
        phone: '(11) 98888-7777',
        document: '529.982.247-25',
        payment: 'À vista',
      }

      await deleteOrdersByCustomerEmail(customer.email)

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectCashPayment()
      await app.checkout.expectCashPaymentTotal(total)
      await app.checkout.expectSummaryTotal(total)
      await app.checkout.acceptTerms()

      await app.checkout.submit()

      await app.checkout.expectOrderApproved({
        fullName: `${customer.name} ${customer.lastname}`,
        email: customer.email,
        store: 'Velô Paulista - Av. Paulista, 1000',
        total,
      })
    })

    test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento', async ({ app }) => {
      const customer = {
        name: 'Jeremias',
        lastname: 'Alcântara',
        email: 'jeremias.alcantara@email.com',
        phone: '(11) 97777-6666',
        document: '293.655.810-79',
        payment: 'Financiamento',
      }

      await deleteOrdersByCustomerEmail(customer.email)
      await app.mocks.creditAnalysis.withScore(710)

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectFinancedPayment()
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('APROVADO')
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

      await deleteOrdersByCustomerEmail(customer.email)
      await app.mocks.creditAnalysis.withScore(600)

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectFinancedPayment()
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('EM_ANALISE')
      const orderId = await page.getByTestId('order-id').textContent()
      expect(orderId).toMatch(/^VLO-[A-Z0-9]{6}$/)

      await page.getByTestId('goto-consultar').click()
      await app.orderLookup.searchOrder(orderId!)
      await app.orderLookup.validateStatusBadge('EM_ANALISE')
    })

    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento', async ({ app }) => {
      const customer = {
        name: 'Jurema',
        lastname: 'Almeida',
        email: 'jurema.almeida@email.com',
        phone: '(48) 98888-7877',
        document: '397.414.890-64',
        payment: 'Financiamento',
        downPayment: '10000',
      }

      await deleteOrdersByCustomerEmail(customer.email)
      await app.mocks.creditAnalysis.withScore(500)

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectPaymentMethod(customer.payment)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('REPROVADO')
    })

    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada menor que 50%', async ({ app }) => {
      const customer = {
        name: 'Adamastor',
        lastname: 'Santos',
        email: 'adamastro.santos@email.com',
        phone: '(48) 99999-8888',
        document: '111.444.777-35',
        payment: 'Financiamento',
        downPayment: '10000',
      }

      await deleteOrdersByCustomerEmail(customer.email)
      await app.mocks.creditAnalysis.withScore(500)

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectPaymentMethod(customer.payment)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('REPROVADO')
    })

    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada igual a 50%', async ({ app }) => {
      const customer = {
        name: 'Anna Carolina',
        lastname: 'Costa',
        email: 'anna.costa@email.com',
        phone: '(48) 99999-8888',
        document: '347.462.770-87',
        payment: 'Financiamento',
        downPayment: '20000',
      }

      await deleteOrdersByCustomerEmail(customer.email)
      await app.mocks.creditAnalysis.withScore(450)

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectPaymentMethod(customer.payment)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('APROVADO')
    })

    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada maior que 50%', async ({ app }) => {
      const customer = {
        name: 'Roberto Carlos',
        lastname: 'Silva',
        email: 'roberto.silva@email.com',
        phone: '(48) 99999-8888',
        document: '725.822.310-02',
        payment: 'Financiamento',
        downPayment: '30000',
      }

      await deleteOrdersByCustomerEmail(customer.email)
      await app.mocks.creditAnalysis.withScore(300)

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(store)
      await app.checkout.selectPaymentMethod(customer.payment)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('APROVADO')
    })
  })

})
