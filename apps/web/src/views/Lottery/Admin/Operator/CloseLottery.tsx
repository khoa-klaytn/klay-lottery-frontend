import { Button } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallback, useRef } from 'react'
import { setRefCustomValidity } from 'utils/customValidity'
import { handleCustomError } from 'utils/viem'
import { BaseError } from 'viem'

export default function CloseLottery({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  const btnRef = useRef<HTMLInputElement>(null)

  const closeLottery = useCallback(async () => {
    try {
      const res = await callWithGasPrice(lotteryContract, 'closeLottery', [BigInt(lotteryId)])
      console.log(res)
    } catch (e) {
      console.error(e)
      if (e instanceof BaseError) {
        handleCustomError(e, {
          LotteryNotOpen: (_, msg) => setRefCustomValidity(btnRef, msg),
          LotteryNotOver: (_, msg) => setRefCustomValidity(btnRef, msg),
        })
      }
    }
  }, [callWithGasPrice, lotteryContract, lotteryId])

  return <input type="submit" onClick={closeLottery} disabled={status !== LotteryStatus.OPEN} value="Close Lottery" />
}
