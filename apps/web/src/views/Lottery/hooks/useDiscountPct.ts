import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useLottery } from 'state/lottery/hooks'

export default function useCalcDiscountPct() {
  const {
    currentRound: { discountDivisor },
  } = useLottery()

  /**
   * @see https://www.desmos.com/calculator/t887blvnkt
   */
  const calcDiscountPct = useCallback(
    (n: number) => {
      const discountPct = new BigNumber(n).minus(1).div(discountDivisor).times(100)
      return new BigNumber(discountPct.toPrecision(4)).toString()
    },
    [discountDivisor],
  )

  return calcDiscountPct
}
