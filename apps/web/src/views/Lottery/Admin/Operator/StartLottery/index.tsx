import { Button, Input } from '@sweepstakes/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useSSLotteryContract } from 'hooks/useContract'
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react'
import { HasSetCustomValidity, setRefCustomValidity } from 'utils/customValidity'
import { handleCustomError } from 'utils/viem'
import { formatEther } from 'viem'
import { EMsg } from '../../EMsg'
import EndTime from './EndTime'
import RewardsBreakdown, { type RewardsBreakdownRef } from './RewardsBreakdown'

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
  const rewardsBreakdownRef = useRef<RewardsBreakdownRef>(null)
  const [rewardsBreakdown, setRewardsBreakdown] = useState(['1000', '1125', '1250', '1375', '1625', '2625'])

  const [eMsg, setEMsg] = useState('')
  const [wnbEMsg, setWnbEMsg] = useState('') // [winners & burn] error message
  const [winnersPortion, setWinnersPortion] = useState('8000')
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
          rewardsBreakdown.map(BigInt),
        ])
        console.log(res)
      } catch (e) {
        handleCustomError(e, {
          LotteryNotClaimable: (_, msg) => setEMsg(msg),
          EndTimePast: (_, msg) => endTimeRef.current.setCustomValidity(msg),
          TicketPriceLow: ([min]) =>
            setRefCustomValidity(ticketPriceInUsdRef, `TicketPriceLow: [min: ${formatEther(min)}]`),
          DiscountDivisorLow: (_, msg) => setRefCustomValidity(discountDivisorRef, msg),
          PortionsInvalidLen: (_, msg) => rewardsBreakdownRef.current.setEMsg(msg),
          PortionDescending: (_, msg) => rewardsBreakdownRef.current.setEMsg(msg),
          PortionsExceedMax: ([name], msg) => {
            switch (name) {
              case 'winners & burn':
                setWnbEMsg(msg)
                break
              case 'rewards':
                rewardsBreakdownRef.current.setEMsg(msg)
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
      rewardsBreakdown,
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
        <header>Winners & Burn Portions</header>
        {wnbEMsg && <EMsg>{wnbEMsg}</EMsg>}
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
      <RewardsBreakdown ref={rewardsBreakdownRef} value={rewardsBreakdown} setRewardsBreakdown={setRewardsBreakdown} />
      <Button type="submit" disabled={disabled}>
        Start Lottery
      </Button>
      {eMsg && <EMsg>{eMsg}</EMsg>}
    </form>
  )
}
