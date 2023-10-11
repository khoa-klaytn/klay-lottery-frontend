import { Button, Input } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useKlayLotteryContract } from 'hooks/useContract'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import { parseEther } from 'viem'

export function StartLottery({ lotteryId, status }) {
  const disabled = useMemo(() => status !== LotteryStatus.CLAIMABLE && lotteryId !== '0', [status, lotteryId])
  const { callWithGasPrice } = useCallWithGasPrice()
  const lotteryContract = useKlayLotteryContract()
  const [endTime, setEndTime] = useState(() => {
    const now = new Date()
    const month = `${now.getMonth() + 1}`.padStart(2, '0')
    const date = `${now.getDate()}`.padStart(2, '0')
    const hours = `${now.getHours()}`.padStart(2, '0')
    const minutes = `${now.getMinutes()}`.padStart(2, '0')
    return `${now.getFullYear()}-${month}-${date}T${hours}:${minutes}`
  })
  const [priceTicket, setPriceTicket] = useState('1')
  const [discountDivisor, setDiscountDivisor] = useState('2000')
  const [reward1, setReward1] = useState('200')
  const [reward2, setReward2] = useState('300')
  const [reward3, setReward3] = useState('500')
  const [reward4, setReward4] = useState('1500')
  const [reward5, setReward5] = useState('2500')
  const [reward6, setReward6] = useState('5000')
  const [winnersPortion, setWinnersPortion] = useState('8000')
  const [burnPortion, setBurnPortion] = useState('1000')

  const startLottery = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()

      const parsedEndTime = Math.ceil(new Date(endTime).getTime() / 1000)
      const parsedPriceTicket = parseEther(priceTicket)

      const res = await callWithGasPrice(lotteryContract, 'startLottery', [
        BigInt(parsedEndTime),
        BigInt(parsedPriceTicket),
        BigInt(discountDivisor),
        [BigInt(reward1), BigInt(reward2), BigInt(reward3), BigInt(reward4), BigInt(reward5), BigInt(reward6)],
        BigInt(winnersPortion),
        BigInt(burnPortion),
      ])
      console.log(res)
    },
    [
      callWithGasPrice,
      lotteryContract,
      endTime,
      priceTicket,
      discountDivisor,
      reward1,
      reward2,
      reward3,
      reward4,
      reward5,
      reward6,
      winnersPortion,
      burnPortion,
    ],
  )

  return (
    <form onSubmit={startLottery}>
      <label>
        endTime
        <Input
          type="datetime"
          name="endTime"
          id="endTime"
          value={endTime}
          onInput={(ev) => setEndTime(ev.currentTarget.value)}
        />
      </label>
      <label>
        priceTicket
        <Input
          type="number"
          name="priceTicket"
          id="priceTicket"
          value={priceTicket}
          onInput={(ev) => setPriceTicket(ev.currentTarget.value)}
        />
      </label>
      <label>
        discountDivisor
        <Input
          type="number"
          name="discountDivisor"
          id="discountDivisor"
          value={discountDivisor}
          onInput={(ev) => setDiscountDivisor(ev.currentTarget.value)}
        />
      </label>
      <fieldset>
        <header>Rewards Breakdown</header>
        <label>
          1
          <Input
            type="number"
            name="reward1"
            id="reward1"
            value={reward1}
            onInput={(ev) => setReward1(ev.currentTarget.value)}
          />
        </label>
        <label>
          2
          <Input
            type="number"
            name="reward2"
            id="reward2"
            value={reward2}
            onInput={(ev) => setReward2(ev.currentTarget.value)}
          />
        </label>
        <label>
          3
          <Input
            type="number"
            name="reward3"
            id="reward3"
            value={reward3}
            onInput={(ev) => setReward3(ev.currentTarget.value)}
          />
        </label>
        <label>
          4
          <Input
            type="number"
            name="reward4"
            id="reward4"
            value={reward4}
            onInput={(ev) => setReward4(ev.currentTarget.value)}
          />
        </label>
        <label>
          5
          <Input
            type="number"
            name="reward5"
            id="reward5"
            value={reward5}
            onInput={(ev) => setReward5(ev.currentTarget.value)}
          />
        </label>
        <label>
          6
          <Input
            type="number"
            name="reward6"
            id="reward6"
            value={reward6}
            onInput={(ev) => setReward6(ev.currentTarget.value)}
          />
        </label>{' '}
      </fieldset>
      <fieldset>
        <header>Portions</header>
        <label>
          winnersPortion
          <Input
            type="number"
            name="winnersPortion"
            id="winnersPortion"
            value={winnersPortion}
            onInput={(ev) => setWinnersPortion(ev.currentTarget.value)}
          />
        </label>
        <label>
          burnPortion
          <Input
            type="number"
            name="burnPortion"
            id="burnPortion"
            value={burnPortion}
            onInput={(ev) => setBurnPortion(ev.currentTarget.value)}
          />
        </label>
      </fieldset>
      <Button type="submit" disabled={disabled}>
        Start Lottery
      </Button>
    </form>
  )
}
