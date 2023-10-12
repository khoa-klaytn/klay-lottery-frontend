import { LotteryStatus } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useKlayLotteryContract } from 'hooks/useContract'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import { useLottery } from 'state/lottery/hooks'

export default function InjectFunds() {
  const { callWithGasPrice } = useCallWithGasPrice()
  const lotteryContract = useKlayLotteryContract()
  const [amount, setAmount] = useState(0)
  const {
    currentRound: { status },
  } = useLottery()
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
