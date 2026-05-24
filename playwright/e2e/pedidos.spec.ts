import { test } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
import { Navbar } from '../support/components/Navbar'
import { LandingPage } from '../support/pages/LandingPage'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'


// AAA - Arrange, Act, Assert(melhor padrão de automação) - Preparar, Agir, Assertar/verificar

test.describe('Consulta de Pedidos', () => {

  let orderLockupPage: OrderLockupPage


  test.beforeEach(async ({ page }) => {
    await new LandingPage(page).goto()
    await new Navbar(page).orderLookupLink()
    console.log('beforeEach: roda antes de cada teste')

    orderLockupPage = new OrderLockupPage(page)
    orderLockupPage.validatePageLoaded()

  })

  test('deve consultar um pedido aprovado', async ({ page }) => {
    const order: OrderDetails = {
      number: 'VLO-P3PW2P',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'JESSICA DA SILVA',
        email: 'jessicaespindoladasilva5@gmail.com'
      },
      payment: 'À Vista'
    }

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {
    const order: OrderDetails = {
      number: 'VLO-E3P5Z3',
      status: 'REPROVADO',
      color: 'Lunar White',
      wheels: 'sport Wheels',
      customer: {
        name: 'Adamastor Limas',
        email: 'ada@gmail.com'
      },
      payment: 'À Vista'
    }
 
    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em análise', async ({ page }) => {
    const order: OrderDetails = {
      number: 'VLO-MF81FS',
      status: 'EM_ANALISE',
      color: 'Midnight Black',
      wheels: 'aero Wheels',
      customer: {
        name: 'Paola Alcântara',
        email: 'paolaalc@gmail.com'
      },
      payment: 'À Vista'
    }

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })


  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode() 

    await orderLockupPage.searchOrder(order)
    await orderLockupPage.validateOrderNotFound()

  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ page }) => {

    const orderCode = 'XYZ1233-INVALID'

    await orderLockupPage.searchOrder(orderCode)
    await orderLockupPage.validateOrderNotFound()

  })
})



