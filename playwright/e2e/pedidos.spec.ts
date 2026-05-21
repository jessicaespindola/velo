import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
import { OrderLockupPage } from '../support/pages/OrderLockupPage'


// AAA - Arrange, Act, Assert(melhor padrão de automação) - Preparar, Agir, Assertar/verificar

test.describe('Consulta de Pedidos', () => {


  test.beforeEach(async ({ page }) => {
    console.log('beforeEach: roda antes de cada teste')

    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    // Acessar a página de consulta de pedidos
    // xpatch a[text()="Consultar Pedido"]
    // cssSelector a[href="/lookup"]
    // Act
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-P3PW2P',
      status: 'APROVADO' as const,
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'JESSICA DA SILVA',
        email: 'jessicaespindoladasilva5@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-E3P5Z3',
      status: 'REPROVADO' as const,
      color: 'Lunar White',
      wheels: 'sport Wheels',
      customer: {
        name: 'Adamastor Limas',
        email: 'ada@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em análise', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-MF81FS',
      status: 'EM_ANALISE' as const,
      color: 'Midnight Black',
      wheels: 'aero Wheels',
      customer: {
        name: 'Paola Alcântara',
        email: 'paolaalc@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
     - img
     - paragraph: Pedido
     - paragraph: ${order.number}
     - status:
       - img
       - text: ${order.status}
     - img "Velô Sprint"
     - paragraph: Modelo
     - paragraph: Velô Sprint
     - paragraph: Cor
     - paragraph: ${order.color}
     - paragraph: Interior
     - paragraph: cream
     - paragraph: Rodas
     - paragraph: ${order.wheels}
     - heading "Dados do Cliente" [level=4]
     - paragraph: Nome
     - paragraph: ${order.customer.name}
     - paragraph: Email
     - paragraph: ${order.customer.email}
     - paragraph: Loja de Retirada
     - paragraph
     - paragraph: Data do Pedido
     - paragraph: /\\d+\\/\\d+\\/\\d+/
     - heading "Pagamento" [level=4]
     - paragraph: ${order.payment}
     - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
     `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })


  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)


    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)

  })
})



