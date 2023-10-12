import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useKlayLotteryContract } from 'hooks/useContract'
import Reset from './Reset'

export default function Owner() {
  const { callWithGasPrice } = useCallWithGasPrice()
  const lotteryContract = useKlayLotteryContract()

  return (
    <>
      <Reset callWithGasPrice={callWithGasPrice} lotteryContract={lotteryContract} />
    </>
  )
}
