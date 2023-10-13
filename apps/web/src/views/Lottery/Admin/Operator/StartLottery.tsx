import { Button, Input } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useKlayLotteryContract } from 'hooks/useContract'
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react'
import { setRefChildCustomValidity, setRefCustomValidity } from 'utils/customValidity'
import { handleCustomError } from 'utils/viem'
import { BaseError, formatEther, parseEther } from 'viem'

export default function StartLottery({ lotteryId, status }) {
  const disabled = useMemo(() => status !== LotteryStatus.CLAIMABLE && lotteryId !== '0', [status, lotteryId])
  const { callWithGasPrice } = useCallWithGasPrice()
  const lotteryContract = useKlayLotteryContract()
  const endTimeRef = useRef<HTMLInputElement>(null)
  const [endTime, setEndTime] = useState(() => {
    const now = new Date()
    const month = `${now.getMonth() + 1}`.padStart(2, '0')
    const date = `${now.getDate()}`.padStart(2, '0')
    const hours = `${now.getHours()}`.padStart(2, '0')
    const minutes = `${now.getMinutes()}`.padStart(2, '0')
    return `${now.getFullYear()}-${month}-${date}T${hours}:${minutes}`
  })
  const priceTicketRef = useRef<HTMLInputElement>(null)
  const [priceTicket, setPriceTicket] = useState('1')
  const discountDivisorRef = useRef<HTMLInputElement>(null)
  const [discountDivisor, setDiscountDivisor] = useState('2000')
  const [reward1, setReward1] = useState('200')
  const [reward2, setReward2] = useState('300')
  const [reward3, setReward3] = useState('500')
  const [reward4, setReward4] = useState('1500')
  const [reward5, setReward5] = useState('2500')
  const [reward6, setReward6] = useState('5000')

  const wnbPortionsRef = useRef<HTMLFieldSetElement>(null)
  const [winnersPortion, setWinnersPortion] = useState('8000')
  const rewardPortionsRef = useRef<HTMLFieldSetElement>(null)
  const [burnPortion, setBurnPortion] = useState('1000')

  const startLottery = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()

      const parsedEndTime = Math.ceil(new Date(endTime).getTime() / 1000)
      const parsedPriceTicket = parseEther(priceTicket)

      try {
        const res = await callWithGasPrice(lotteryContract, 'startLottery', [
          BigInt(parsedEndTime),
          BigInt(parsedPriceTicket),
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
            EndTimePast: (_, msg) => setRefCustomValidity(endTimeRef, msg),
            TicketPriceLow: ([min]) =>
              setRefCustomValidity(priceTicketRef, `TicketPriceLow: [min: ${formatEther(min)}]`),
            DiscountDivisorLow: (_, msg) => setRefCustomValidity(discountDivisorRef, msg),
            PortionsExceed10000: ([name], msg) => {
              switch (name) {
                case 'winners & burn':
                  setRefChildCustomValidity(wnbPortionsRef, msg)
                  break
                case 'rewards':
                  setRefChildCustomValidity(rewardPortionsRef, msg)
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
          ref={endTimeRef}
          onInput={(ev) => {
            setRefCustomValidity(endTimeRef, '')
            setEndTime(ev.currentTarget.value)
          }}
        />
      </label>
      <label>
        priceTicket
        <Input
          type="number"
          name="priceTicket"
          id="priceTicket"
          value={priceTicket}
          ref={priceTicketRef}
          onInput={(ev) => {
            setRefCustomValidity(priceTicketRef, '')
            setPriceTicket(ev.currentTarget.value)
          }}
        />
      </label>
      <label>
        discountDivisor
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
      <fieldset ref={wnbPortionsRef}>
        <header>Winners & Burn Portions</header>
        <label>
          winnersPortion
          <Input
            type="number"
            name="winnersPortion"
            id="winnersPortion"
            value={winnersPortion}
            onInput={(ev) => {
              setRefChildCustomValidity(wnbPortionsRef, '')
              setWinnersPortion(ev.currentTarget.value)
            }}
          />
        </label>
        <label>
          burnPortion
          <Input
            type="number"
            name="burnPortion"
            id="burnPortion"
            value={burnPortion}
            onInput={(ev) => {
              setRefChildCustomValidity(wnbPortionsRef, '')
              setBurnPortion(ev.currentTarget.value)
            }}
          />
        </label>
      </fieldset>
      <fieldset ref={rewardPortionsRef}>
        <header>Reward Portions</header>
        <label>
          1
          <Input
            type="number"
            name="reward1"
            id="reward1"
            value={reward1}
            onInput={(ev) => {
              setRefChildCustomValidity(rewardPortionsRef, '')
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
              setRefChildCustomValidity(rewardPortionsRef, '')
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
              setRefChildCustomValidity(rewardPortionsRef, '')
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
              setRefChildCustomValidity(rewardPortionsRef, '')
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
              setRefChildCustomValidity(rewardPortionsRef, '')
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
              setRefChildCustomValidity(rewardPortionsRef, '')
              setReward6(ev.currentTarget.value)
            }}
          />
        </label>
      </fieldset>
      <Button type="submit" disabled={disabled}>
        Start Lottery
      </Button>
    </form>
  )
}
