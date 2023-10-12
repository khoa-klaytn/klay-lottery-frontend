import Reset from './Reset'

export default function Owner({ callWithGasPrice, lotteryContract }) {
  return (
    <>
      <Reset callWithGasPrice={callWithGasPrice} lotteryContract={lotteryContract} />
    </>
  )
}
