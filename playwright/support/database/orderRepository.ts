import { db } from './database'
import { OrderTable } from './schema'
import type { OrderDetails } from '../types'
import crypto from 'crypto'

export function normalizeValue(value: string) {
    if (!value) return ''

    return value
    .normalize('NFD') //separa acento
    .replace(/[\u0300-\u036f]/g, '') //remove acentos
    .replace(/\s+/g, ' ') //remove espaços extras
    .toLowerCase() //converte para minúsculas
}

/** Converte rótulo da massa (ex: "À Vista") para o valor persistido pela app (`avista` | `financiamento`). */
export function toPaymentMethod(payment: string): 'avista' | 'financiamento' {
    const key = normalizeValue(payment).replace(/\s+/g, '')
    if (key.startsWith('financ')) return 'financiamento'
    return 'avista'
}

export async function insertOrder(order: OrderDetails) {

    const data: OrderTable = {
        id: crypto.randomUUID(),
        order_number: order.number,
        color: order.color.toLowerCase().replace(' ', '-'),
        wheel_type: order.wheels.replace(' Wheels', '').toLowerCase(),
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        customer_cpf: order.customer.document,
        payment_method: toPaymentMethod(order.payment),
        total_price: order.total_price,
        status: order.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        optionals: [],
      }
    await db.insertInto('orders').values(data).execute()
}
export async function deleteOrderByNumber(orderNumber: string) {
    await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
}

export async function deleteOrdersByCustomerEmail(email: string) {
    await db.deleteFrom('orders').where('customer_email', '=', email).execute()
}