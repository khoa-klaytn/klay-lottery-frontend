import { LotteryStatus } from 'config/constants/types'
import { useCallback, useState } from 'react'
import { handleCustomError } from 'utils/viem'
import { BaseError } from 'viem'
import { Button } from '@sweepstakes/uikit'
import { EMsg } from '../EMsg'

export default function CloseLottery({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  const [eMsg, setEMsg] = useState('')

  const closeLottery = useCallback(async () => {
    try {
      const res = await callWithGasPrice(lotteryContract, 'closeLottery', [BigInt(lotteryId)])
      setEMsg('')
      console.log(res)
    } catch (e) {
      console.error(e)
      if (e instanceof BaseError) {
        handleCustomError(e, {
          LotteryNotOpen: (_, msg) => setEMsg(msg),
          LotteryNotOver: (_, msg) => setEMsg(msg),
        })
      }
    }
  }, [callWithGasPrice, lotteryContract, lotteryId])

  return (
    <>
      <Button type="button" onClick={closeLottery} disabled={status !== LotteryStatus.OPEN}>
        Close Lottery
      </Button>
      {eMsg && <EMsg>{eMsg}</EMsg>}
    </>
  )
}
