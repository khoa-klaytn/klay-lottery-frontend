import { LotteryStatus } from 'config/constants/types'
import { FormEvent, useCallback, useMemo, useState } from 'react'

export default function InjectFunds({ callWithGasPrice, lotteryContract, status }) {
  const [amount, setAmount] = useState(0)
  const disabled = useMemo(() => status !== LotteryStatus.OPEN, [status])

  const injectFunds = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
      const res = await callWithGasPrice(lotteryContract, 'injectFunds', [BigInt(amount)])
      console.log(res)
    },
    [amount, callWithGasPrice, lotteryContract],
  )

  return (
    <form onSubmit={injectFunds}>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.valueAsNumber)} />
      <button type="submit" disabled={disabled}>
        Inject Funds
      </button>
    </form>
  )
}
