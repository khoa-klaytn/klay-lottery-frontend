import { Button } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallback } from 'react'

export default function CloseLottery({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  const closeLottery = useCallback(async () => {
    const res = await callWithGasPrice(lotteryContract, 'closeLottery', [BigInt(lotteryId)])
    console.log(res)
  }, [callWithGasPrice, lotteryContract, lotteryId])

  return (
    <Button type="button" onClick={closeLottery} disabled={status !== LotteryStatus.OPEN}>
      Close Lottery
    </Button>
  )
}
