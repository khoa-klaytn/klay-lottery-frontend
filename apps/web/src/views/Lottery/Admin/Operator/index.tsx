import StartLottery from './StartLottery'
import CloseLottery from './CloseLottery'
import MakeLotteryClaimable from './MakeLotteryClaimable'

export default function Operator({ callWithGasPrice, lotteryContract, lotteryId, status }) {
  return (
    <>
      <StartLottery lotteryId={lotteryId} status={status} />
      <CloseLottery
        callWithGasPrice={callWithGasPrice}
        lotteryContract={lotteryContract}
        lotteryId={lotteryId}
        status={status}
      />
      <MakeLotteryClaimable
        callWithGasPrice={callWithGasPrice}
        lotteryContract={lotteryContract}
        lotteryId={lotteryId}
        status={status}
      />
    </>
  )
}
