import { test } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectColor('Midnight Black')
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc(/midnight-black-aero-wheels/)
  })

  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectWheels(/Sport Wheels/)
    await app.configurator.expectPrice('R$ 42.000,00')
    await app.configurator.expectCarImageSrc(/glacier-blue-sport-wheels/)

    await app.configurator.selectWheels(/Aero Wheels/)
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc(/glacier-blue-aero-wheels/)
  })

  test('deve validar se o preço é atualizado ao selecionar ou remover os opcionais', async ({ app }) => {
    //O objetivo é validar se o preço do veículo é atualizado corretamente ao selecionar ou remover os opcionais Precision Park (+R$5.500) e Flux Capacitor (+R$5.000)
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.checkOptional(/Precision Park/i) // +R$ 5.500 // marca o checkbox Precision Park
    await app.configurator.expectPrice('R$ 45.500,00')

    await app.configurator.uncheckOptional(/Precision Park/i) // remove o nome Precision Park
    await app.configurator.expectPrice('R$ 40.000,00') // espera o preço R$ 40.000,00


    await app.configurator.checkOptional(/Flux Capacitor/i) // +R$ 5.000 // marca o checkbox Flux Capacitor
    await app.configurator.expectPrice('R$ 45.000,00')

    await app.configurator.uncheckOptional(/Flux Capacitor/i) // remove o nome Flux Capacitor
    await app.configurator.expectPrice('R$ 40.000,00') // espera o preço R$ 40.000,00

    await app.configurator.checkOptional(/Precision Park/i) //marca
    await app.configurator.checkOptional(/Flux Capacitor/i) //marca
    await app.configurator.expectPrice('R$ 50.500,00') //espera o preço R$ 50.500,00

    await app.configurator.uncheckOptional(/Precision Park/i) //remove
    await app.configurator.uncheckOptional(/Flux Capacitor/i) //remove
    await app.configurator.expectPrice('R$ 40.000,00') //espera o preço R$ 40.000,00

    await app.configurator.finishConfigurator() 
    await app.checkout.expectLoaded() 
    await app.checkout.expectSummaryTotal('R$ 40.000,00') 
  })
})
