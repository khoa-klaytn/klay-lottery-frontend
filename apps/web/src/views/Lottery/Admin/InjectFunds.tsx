import { LotteryStatus } from 'config/constants/types'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import { handleCustomError } from 'utils/viem'
import { BaseError } from 'viem'
import { EMsg } from './EMsg'

export default function InjectFunds({ callWithGasPrice, lotteryContract, status }) {
  const [amount, setAmount] = useState(0)
  const disabled = useMemo(() => status !== LotteryStatus.OPEN, [status])
  const [eMsg, setEMsg] = useState('')

  const injectFunds = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
      try {
        const res = await callWithGasPrice(lotteryContract, 'injectFunds', [BigInt(amount)])
        console.log(res)
      } catch (e) {
        console.error(e)
        if (e instanceof BaseError) {
          handleCustomError(e, {
            LotteryNotOpen: (_, msg) => setEMsg(msg),
          })
        }
      }
    },
    [amount, callWithGasPrice, lotteryContract],
  )

  return (
    <form onSubmit={injectFunds}>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.valueAsNumber)} />
      <button type="submit" disabled={disabled}>
        Inject Funds
      </button>
      {eMsg && <EMsg>{eMsg}</EMsg>}
    </form>
  )
}
