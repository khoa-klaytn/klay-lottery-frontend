import { Button, Input } from '@sweepstakes/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useSSLotteryContract } from 'hooks/useContract'
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react'
import { HasSetCustomValidity, setRefCustomValidity } from 'utils/customValidity'
import { handleCustomError } from 'utils/viem'
import { BaseError, formatEther } from 'viem'
import { EMsg } from '../EMsg'
import EndTime from './EndTime'

export default function StartLottery({ lotteryId, status }) {
  const disabled = useMemo(() => status !== LotteryStatus.CLAIMABLE && lotteryId !== '0', [status, lotteryId])
  const { callWithGasPrice } = useCallWithGasPrice()
  const lotteryContract = useSSLotteryContract()
  const endTimeRef = useRef<HasSetCustomValidity>(null)
  const [endTime, setEndTime] = useState(() => {
    const now = new Date()
    const month = `${now.getMonth() + 1}`.padStart(2, '0')
    const date = `${now.getDate()}`.padStart(2, '0')
    const hours = `${now.getHours()}`.padStart(2, '0')
    const minutes = `${now.getMinutes()}`.padStart(2, '0')
    return `${now.getFullYear()}-${month}-${date}T${hours}:${minutes}`
  })
  const ticketPriceInUsdRef = useRef<HTMLInputElement>(null)
  const [ticketPriceInUsd, setTicketPrice] = useState('0.01')
  const discountDivisorRef = useRef<HTMLInputElement>(null)
  const [discountDivisor, setDiscountDivisor] = useState('2000')
  const [reward1, setReward1] = useState('1000')
  const [reward2, setReward2] = useState('1125')
  const [reward3, setReward3] = useState('1250')
  const [reward4, setReward4] = useState('1375')
  const [reward5, setReward5] = useState('1625')
  const [reward6, setReward6] = useState('2625')

  const [eMsg, setEMsg] = useState('')
  const [wnbEMsg, setWnbEMsg] = useState('') // [winners & burn] error message
  const [winnersPortion, setWinnersPortion] = useState('8000')
  const [rewardsEMsg, setRewardsEMsg] = useState('') // [rewards] error message
  const [burnPortion, setBurnPortion] = useState('1000')

  const startLottery = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()

      const parsedEndTime = Math.ceil(new Date(endTime).getTime() / 1000)
      const parsedTicketPrice = BigInt(Math.round(+ticketPriceInUsd * 1e8))

      try {
        const res = await callWithGasPrice(lotteryContract, 'startLottery', [
          BigInt(parsedEndTime),
          BigInt(parsedTicketPrice),
          BigInt(discountDivisor),
          BigInt(winnersPortion),
          BigInt(burnPortion),
          [BigInt(reward1), BigInt(reward2), BigInt(reward3), BigInt(reward4), BigInt(reward5), BigInt(reward6)],
        ])
        console.log(res)
      } catch (e) {
        console.error(e)
        if (e instanceof BaseError)
          handleCustomError(e, {
            LotteryNotClaimable: (_, msg) => setEMsg(msg),
            EndTimePast: (_, msg) => endTimeRef.current.setCustomValidity(msg),
            TicketPriceLow: ([min]) =>
              setRefCustomValidity(ticketPriceInUsdRef, `TicketPriceLow: [min: ${formatEther(min)}]`),
            DiscountDivisorLow: (_, msg) => setRefCustomValidity(discountDivisorRef, msg),
            PortionsInvalidLen: (_, msg) => setRewardsEMsg(msg),
            PortionDescending: (_, msg) => setRewardsEMsg(msg),
            PortionsExceedMax: ([name], msg) => {
              switch (name) {
                case 'winners & burn':
                  setWnbEMsg(msg)
                  break
                case 'rewards':
                  setRewardsEMsg(msg)
                  break
                default:
              }
            },
          })
      }
    },
    [
      callWithGasPrice,
      lotteryContract,
      endTime,
      ticketPriceInUsd,
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
      <EndTime value={endTime} ref={endTimeRef} setEndTime={setEndTime} />
      <label>
        Ticket Price in USD
        <Input
          type="number"
          name="ticketPriceInUsd"
          id="ticketPriceInUsd"
          value={ticketPriceInUsd}
          ref={ticketPriceInUsdRef}
          onInput={(ev) => {
            setRefCustomValidity(ticketPriceInUsdRef, '')
            setTicketPrice(ev.currentTarget.value)
          }}
        />
      </label>
      <label>
        Discount Divisor
        <Input
          type="number"
          name="discountDivisor"
          id="discountDivisor"
          value={discountDivisor}
          ref={discountDivisorRef}
          onInput={(ev) => {
            setRefCustomValidity(discountDivisorRef, '')
            setDiscountDivisor(ev.currentTarget.value)
          }}
        />
      </label>
      <fieldset>
        {wnbEMsg && <EMsg>{wnbEMsg}</EMsg>}
        <header>Winners & Burn Portions</header>
        <label>
          winnersPortion
          <Input
            type="number"
            name="winnersPortion"
            id="winnersPortion"
            value={winnersPortion}
            onInput={(ev) => {
              setWnbEMsg('')
              setWinnersPortion(ev.currentTarget.value)
            }}
          />
        </label>
        <label>
          Burn Portion
          <Input
            type="number"
            name="burnPortion"
            id="burnPortion"
            value={burnPortion}
            onInput={(ev) => {
              setWnbEMsg('')
              setBurnPortion(ev.currentTarget.value)
            }}
          />
        </label>
      </fieldset>
      <fieldset>
        {rewardsEMsg && <EMsg>{rewardsEMsg}</EMsg>}
        <header>Reward Portions</header>
        <label>
          1
          <Input
            type="number"
            name="reward1"
            id="reward1"
            value={reward1}
            onInput={(ev) => {
              setRewardsEMsg('')
              setReward1(ev.currentTarget.value)
            }}
          />
        </label>
        <label>
          2
          <Input
            type="number"
            name="reward2"
            id="reward2"
            value={reward2}
            onInput={(ev) => {
              setRewardsEMsg('')
              setReward2(ev.currentTarget.value)
            }}
          />
        </label>
        <label>
          3
          <Input
            type="number"
            name="reward3"
            id="reward3"
            value={reward3}
            onInput={(ev) => {
              setRewardsEMsg('')
              setReward3(ev.currentTarget.value)
            }}
          />
        </label>
        <label>
          4
          <Input
            type="number"
            name="reward4"
            id="reward4"
            value={reward4}
            onInput={(ev) => {
              setRewardsEMsg('')
              setReward4(ev.currentTarget.value)
            }}
          />
        </label>
        <label>
          5
          <Input
            type="number"
            name="reward5"
            id="reward5"
            value={reward5}
            onInput={(ev) => {
              setRewardsEMsg('')
              setReward5(ev.currentTarget.value)
            }}
          />
        </label>
        <label>
          6
          <Input
            type="number"
            name="reward6"
            id="reward6"
            value={reward6}
            onInput={(ev) => {
              setRewardsEMsg('')
              setReward6(ev.currentTarget.value)
            }}
          />
        </label>
      </fieldset>
      <Button type="submit" disabled={disabled}>
        Start Lottery
      </Button>
      {eMsg && <EMsg>{eMsg}</EMsg>}
    </form>
  )
}
