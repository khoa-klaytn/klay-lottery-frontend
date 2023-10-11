import { Button } from '@pancakeswap/uikit'
import { useCallback } from 'react'

export function Reset({ callWithGasPrice, lotteryContract }) {
  const reset = useCallback(async () => {
    const res = await callWithGasPrice(lotteryContract, 'reset', [])
    console.log(res)
  }, [callWithGasPrice, lotteryContract])

  return (
    <Button type="reset" onClick={reset}>
      Reset
    </Button>
  )
}
