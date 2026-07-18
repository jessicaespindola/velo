import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLookupActions'
import { insertOrder, deleteOrderByNumber} from '../support/database/orderRepository'
import crypto from 'crypto'

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {
    const code = generateOrderCode()
    const order: OrderDetails = {
      number: code,
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'JESSICA DA SILVA',
        email: 'jessicaespindoladasilva5@gmail.com',
      },
      payment: 'À Vista',
    }

    await insertOrder({
    id: crypto.randomUUID(),
    order_number: code,
    color: 'glacier-blue',
    wheel_type: 'aero',
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: '(11) 99999-9999',
    customer_cpf: '12345678900',
    payment_method: 'avista',
    total_price: 40000,
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    optionals: [],
    })

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {
    const code = generateOrderCode()
    const order: OrderDetails = {
      number: code,
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Adamastor Limas',
        email: 'adamastorlimas@gmail.com',
        document: '35471136012',
        phone: '(11) 99999-9999',
      },
      payment: 'À Vista',
      total_price: '40000',
    }

    await insertOrder({
    id: crypto.randomUUID(),
    order_number: code,
    color: 'midnight-black',
    wheel_type: 'sport',
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: '35471136012',
    payment_method: 'avista',
    total_price: 40000,
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    optionals: [],
    })
    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em análise', async ({ app }) => {
    const code = generateOrderCode()
    const order: OrderDetails = {
      number: code,
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Paola Alcântara',
        email: 'paolaalc@gmail.com',
        document: '12345678900',
        phone: '(11) 99999-9999',
      },
      payment: 'À Vista',
      total_price: '40000',
    }
    await insertOrder({
      id: crypto.randomUUID(),
      order_number: code,
      color: 'lunar-white',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '12345678900',
      payment_method: 'avista',
      total_price: 40000,
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })
    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    const order = generateOrderCode()

    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {
    const orderCode = 'XYZ1233-INVALID'

    await app.orderLookup.searchOrder(orderCode)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app, page }) => {

    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled

    await app.orderLookup.elements.orderInput.fill('   ')
    await expect(button).toBeDisabled()
  })
})