import { Button } from '@sweepstakes/uikit'
import { useCallback } from 'react'

export default function Reset({ callWithGasPrice, lotteryContract }) {
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
