import { Button, Input, InputGroup } from '@pancakeswap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useKlayLotteryContract } from 'hooks/useContract'
import { FormEvent, useState } from 'react'
import { parseEther } from 'viem'

export function Admin({ disabled }: { disabled: boolean }) {
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

  async function startLottery(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    const parsedEndTime = Math.ceil(new Date(endTime).getTime() / 1000)
    const parsedPriceTicket = parseEther(priceTicket)

    const res = await callWithGasPrice(
      lotteryContract,
      'startLottery',
      [
        BigInt(parsedEndTime),
        BigInt(parsedPriceTicket),
        BigInt(discountDivisor),
        [BigInt(reward1), BigInt(reward2), BigInt(reward3), BigInt(reward4), BigInt(reward5), BigInt(reward6)],
        BigInt(winnersPortion),
        BigInt(burnPortion),
      ],
      {
        gasLimit: 2000000,
      },
    )
    console.log(res)
  }

  return (
    <form onSubmit={startLottery}>
      <Input type="datetime" name="endTime" value={endTime} onInput={(ev) => setEndTime(ev.currentTarget.value)} />
      <Input
        type="number"
        name="priceTicket"
        value={priceTicket}
        onInput={(ev) => setPriceTicket(ev.currentTarget.value)}
      />
      <Input
        type="number"
        name="discountDivisor"
        value={discountDivisor}
        onInput={(ev) => setDiscountDivisor(ev.currentTarget.value)}
      />
      <InputGroup>
        <>
          <Input type="number" name="reward1" value={reward1} onInput={(ev) => setReward1(ev.currentTarget.value)} />
          <Input type="number" name="reward2" value={reward2} onInput={(ev) => setReward2(ev.currentTarget.value)} />
          <Input type="number" name="reward3" value={reward3} onInput={(ev) => setReward3(ev.currentTarget.value)} />
          <Input type="number" name="reward4" value={reward4} onInput={(ev) => setReward4(ev.currentTarget.value)} />
          <Input type="number" name="reward5" value={reward5} onInput={(ev) => setReward5(ev.currentTarget.value)} />
          <Input type="number" name="reward6" value={reward6} onInput={(ev) => setReward6(ev.currentTarget.value)} />
        </>
      </InputGroup>
      <InputGroup>
        <>
          <Input
            type="number"
            name="winnersPortion"
            value={winnersPortion}
            onInput={(ev) => setWinnersPortion(ev.currentTarget.value)}
          />
          <Input
            type="number"
            name="burnPortion"
            value={burnPortion}
            onInput={(ev) => setBurnPortion(ev.currentTarget.value)}
          />
        </>
      </InputGroup>
      <Button type="submit" disabled={disabled}>
        Start Lottery
      </Button>
    </form>
  )
}
