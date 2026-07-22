import { describe, it, expect } from 'vitest';
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  type CarConfiguration,
} from './configuratorStore';

const baseConfig = (overrides: Partial<CarConfiguration> = {}): CarConfiguration => ({
  exteriorColor: 'glacier-blue',
  interiorColor: 'carbon-black',
  wheelType: 'aero',
  optionals: [],
  ...overrides,
});

describe('calculateTotalPrice', () => {
  it('retorna o preço base para aero sem opcionais', () => {
    // Arrange
    const config = baseConfig({ wheelType: 'aero', optionals: [] });

    // Act
    const total = calculateTotalPrice(config);

    // Assert
    expect(total).toBe(40000);
  });

  it('soma sport wheels e um opcional ao preço base', () => {
    // Arrange — base 40000 + sport 2000 + precision-park 5500
    const config = baseConfig({
      wheelType: 'sport',
      optionals: ['precision-park'],
    });

    // Act
    const total = calculateTotalPrice(config);

    // Assert
    expect(total).toBe(47500);
  });
});

describe('calculateInstallment', () => {
  it('calcula a parcela de 40000 com 2 casas decimais', () => {
    // Arrange
    const total = 40000;

    // Act
    const installment = calculateInstallment(total);

    // Assert — 12x com juros compostos de 2% a.m.
    expect(installment).toBe(3782.38);
    expect(Number.isInteger(installment * 100)).toBe(true);
  });
});

describe('formatPrice', () => {
  it('formata valor em BRL (pt-BR)', () => {
    // Arrange
    const value = 40000;

    // Act
    const formatted = formatPrice(value);

    // Assert
    expect(formatted).toMatch(/R\$/);
    expect(formatted).toContain('40.000');
  });
});
