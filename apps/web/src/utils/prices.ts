import { Currency, Price } from '@sweepstakes/sdk'
/**
 * Helper to multiply a Price object by an arbitrary amount
 */
export const multiplyPriceByAmount = (
  price: Price<Currency, Currency> | undefined,
  amount: number,
  significantDigits = 18,
) => {
  if (!price) {
    return 0
  }

  try {
    return parseFloat(price.toSignificant(significantDigits)) * amount
  } catch (error) {
    return 0
  }
}
